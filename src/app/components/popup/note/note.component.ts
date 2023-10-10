import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DbQueryService} from "../../../shared/query/db.query.service";
import {RestService} from "../../../shared/tools/rest.service";
import {Releve} from "../../../shared/interface/Releve";
import {ViewSdkService} from "../../../shared/sdk/view.sdk.service";
import {base64_encode} from "devextreme/data/utils";
import {ListService} from "../../../shared/tools/list.service";
import {RuleService} from "../../../shared/tools/rule.service";

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
    private db: DbQueryService,
    private rest: RestService,
    private viewSdkService: ViewSdkService,
    private listService: ListService,
    private ruleService: RuleService){}

  ngOnInit(): void {
    // TODO
  }

  /**
   * Si la seletion du relevé de notes a changé.
   */
  ngOnChanges(): void {

    if (this.rn) {
      // Select notes
      this.path = 'shutters/' + this.shutter + '/rn/' + this.rn.id + '/notes/';
      this.db.select(this.path).valueChanges().subscribe(
        (notes: any[]) => {
          this.labels = this.listService.matters();
          this.notes = notes;
        }
      );
      let path_matters = '/shutters/' + this.shutter + '/matters';
      this.db.select(path_matters).valueChanges().subscribe(
        (matters: any[]) => {
          this.matters = matters.filter(
            (matter: any) => {
              return matter.serial == this.rn?.serial;
            }
          );
        }
      );
    }
  }

  /**
   * Ajout d'une note.
   * @param e
   */
  onRowInserted(e: any) {
    if (this.rn) {
      this.onRowUpdated(e);
      e.component.addRow();
    }
  }

  /**
   * Modification d'une note.
   * @param e
   */
  onRowUpdated(e: any) {
    let data: any;
    if (e.data && e.data.id) {
      data = e.data;
      data.id = e.data.id;
    } else if (e.oldData && e.oldData.id) {
      data = e.newData;
      data.id = e.oldData.id;
    }

    const cible = this.path + data.id;
    this.db.insert(cible, data);

    // Recalcul de la moyenne
    const result: any = this.ruleService.moy({ rn: this.rn, matters: this.matters, notes: this.notes });
    if (result && result.moy) {
      const cible = 'shutters/' + this.shutter + '/rn/' + this.rn.id;
      this.rn.moy = result.moy;
      this.rn.mention = result.mention;
      this.rn.decision = result.decision;
      this.db.update(cible, this.rn);
    }
  }

  /**
   * Suppression d'une note.
   * @param e
   */
  onRowRemoved(e: any) {
    if (e.data.id) {
      let p = this.path + e.data.id;
      this.db.delete(p).then();
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
            this.rest.prepare(this.student.uid, new Releve('', '', { rn: this.rn, matters: this.matters, notes: this.notes })).then(
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
