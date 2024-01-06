import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RestService} from "../../../shared/tools/rest.service";
import {ViewSdkService} from "../../../shared/sdk/view.sdk.service";
import {Error} from "../../../shared/notify/error";
import {Success} from "../../../shared/notify/success";
import {NotifyService} from "../../../shared/notify/services/notify.service";
import {Releve} from "../../../shared/interface/Releve";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnChanges {
  @Input() rn: any;
  @Input() shutter: string = '';
  @Input() student: any;

  notes: any[] = [];
  path: string = '';
  matters: any[] = [];

  labels: any[] = [];
  constructor(
    private notifyService: NotifyService,
    private rest: RestService,
    private viewSdkService: ViewSdkService
  ){}

  ngOnInit(): void {
    // TODO
  }

  /**
   * Si la seletion du relevé de notes a changé.
   */
  ngOnChanges(): void {

    if (this.rn) {
      // Recupération de la liste des labels matières.
      this.rest.request({ action: "matters_labels" }).then(
        (result: any) => {
          if (result.list) {
            this.labels = result.list;
          }
        }
      );
      // Liste des matières selon la série.
      this.rest.request({ action: "matters" }).then(
        (result: any) => {
          if (result.list) {
            this.matters = result.list.filter(
              (matter: any) => {
                return matter.serial == this.rn?.serial;
              }
            );
          }
        }
      );
      // Select notes
      this.rest.request({ action: "notes", rnid: this.rn.id }).then(
        (result: any) => {
          if (result.list) {
            this.notes = result.list;
          }
        }
      );
    }
  }

  /**
   * Ajout d'une note.
   * @param e
   */
  onRowInserted(e: any) {
    if (e.data) {
      this.updateRow(e.data, 'add_note');
    }
  }

  /**
   * Modification d'une note.
   * @param e
   */
  onRowUpdated(e: any) {
    if (e.data) {
      this.updateRow(e.data);
    }
  }

  updateRow(data: any, action: string = 'update_note') {
    data.releve = this.rn.id;
    this.rest.request({ action: action, data: data }).then(
      (result: any) => {
        console.log(result);
        if (result.code && result.code === 200) {
          if (action == 'add_note') {
            data.id = result.data;
            this.notifyService.notify(new Success('Insertion terminée avec succès'));
          } else {
            this.notifyService.notify(new Success('Mise à jour terminée avec succès'));
          }
        } else {
          this.notifyService.notify(new Error(result.message, 'error', 3000));
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 3000));
      }
    );
  }
  /**
   * Suppression d'une note.
   * @param e
   */
  onRowRemoved(e: any) {
    if (e.data.id) {
      this.rest.request({ action: "remove_note", id: e.data.id }).then(
        (result: any) => {
          if (result.code && result.code === 200) {
            this.notifyService.notify(new Success('Suppression terminée avec succès.'));
          } else {
            this.notifyService.notify(new Error(result.message, 'error', 3000));
          }
        },
        (error: any) => {
          this.notifyService.notify(new Error(error.error.message, 'error', 3000));
        }
      );
    }
  }

  /**
   * Ajout des bouton dans le menu action du DataGrid
   * @param e
   */
  alterDataGriOperation(e: any) {
    e.toolbarOptions.items.push(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'checklist',
          text: 'Notes'
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'pdffile',
          text: 'PDF',
          onClick: () => {
            this.rest.prepare(this.student, new Releve('', '', { rn: this.rn, matters: this.matters, notes: this.notes })).then(
              (doc: any) => {
                const error_message: string = '<p>Nous avons rencontré un problème lors de la génération du document.</p>';
                this.rest.send(doc).then(
                  (response: any) => {
                    if (!Array.isArray(response) && response.releves_notes && response && response.releves_notes.errorCode == 0) {
                      this.viewSdkService.ready().then(
                        () => {
                          this.viewSdkService.previewFile('pdf-view', { defaultViewMode: "FIT_WIDTH" }, response.releves_notes.file.content);
                        }
                      );
                    } else {
                      let elt = document.getElementById('pdf-view');
                      if (elt) {
                        elt.innerHTML = error_message;
                        console.log(response);
                      }
                    }
                  },
                  (error: any) => {
                    let elt = document.getElementById('pdf-view');
                    if (elt) {
                      elt.innerHTML = error_message;
                      console.log(error);
                    }
                  }
                );
              }
            );
          }
        }
      }
    );
  }
}
