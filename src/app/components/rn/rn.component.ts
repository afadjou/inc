import {Component, OnInit} from '@angular/core';
import {AuthService} from "../user/services/auth.service";
import {FileService} from "../../shared/file/services/file.service";
import {NotifyService} from "../../shared/notify/services/notify.service";
import {ActivatedRoute} from "@angular/router";
import {UserQuery} from "../../shared/query/user.query";
import {SubjectService} from "../../shared/subscriber/subject.service";
import {DbQueryService} from "../../shared/query/db.query.service";
import {RestService} from "../../shared/tools/rest.service";
import {Releve} from "../../shared/interface/Releve";
import {ViewSdkService} from "../../shared/sdk/view.sdk.service";
import {ListService} from "../../shared/tools/list.service";
import {Warning} from "../../shared/notify/warning";
import {Error} from "../../shared/notify/error";
import {Success} from "../../shared/notify/success";
import {compileResults} from "@angular/compiler-cli/src/ngtsc/annotations/common";

@Component({
  selector: 'app-rn',
  templateUrl: './rn.component.html',
  styleUrls: [
    './rn.component.scss',
    '../../../assets/themes/scss/base/_grid.scss'
  ]
})
export class RnComponent implements OnInit {

  student: any;
  rns: any[] = [];
  matters: any[] = [];
  rn: any;
  shutter: string = '';
  path: string = '';
  serials: any[] = [];
  centers: any[] = [];
  scenters: any[] = [];
  focusedRowKey = 117;

  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private uq: UserQuery,
    private subject: SubjectService,
    public db: DbQueryService,
    private rest: RestService,
    private viewSdkService: ViewSdkService,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.shutter = localStorage.getItem('shutter_id') ?? '';
    this.path = 'shutters/' + this.shutter + '/rn/';

    // Liste des séries
    this.rest.request({ action: "series" }).then(
      (result: any) => {
        if (result.list) {
          this.serials = result.list;
        }
      }
    );

    // List de centres
    this.rest.request({ action: "centers" }).then(
      (result: any) => {
        if (result.list) {
          this.centers = result.list;
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 3000));
      }
    );

    // List de sous centres
    this.rest.request({ action: "scenters" }).then(
      (result: any) => {
        if (result.list) {
          this.scenters = result.list;
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 3000));
      }
    );

    // Etudiant
    const uid = this.route.snapshot.params['uid'];
    this.rest.request({ action: "user", uid: uid }).then(
      (result: any) => {
        if (result.user) {
          this.student = result.user;
        }
      }
    );
    // Liste des RN
    this.rest.request({ action: "notes_list", uid: uid }).then(
      (result: any) => {
        if (result.list) {
          this.rns = result.list.sort((a: any, b: any) => {
            return b.type.localeCompare(a.type);
          });
          this.rn = this.rn ?? this.rns.at(0);

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

          this.focusedRowKey = this.rn?.id;
          this.doc();
        }
      }
    );

    // Reduction du sidebare
    let chevron_left = document.getElementById('chevrondoubleleft');
    let chevron_right = document.getElementById('chevrondoubleright');
    let slide_content = document.getElementById('col-content-left');
    let menu = document.getElementById('navbarDefault');
    if (slide_content && menu && chevron_left && chevron_right) {
      chevron_left.style.display = 'none';
      chevron_right.style.display = 'block';
      slide_content.style.width = "55px";
      menu.style.left = "4px";
    }
    this.subject.emitShutter(this.shutter);
  }

  onSelectionChangeed(e: any) {
    if (e.row.data) {
      this.rn = e.row.data;

      this.doc();
    }
  }

  /**
   * Ajout d'un relevé de notes
   * @param e
   */
  onRowInserted(e: any) {
    this.updateRow(e.data, 'add_rn');
  }

  /**
   * Modification d'un rlevé de notes.
   * @param e
   */
  onRowUpdated(e: any) {
    this.updateRow(e.data);

    // Regenration editique
    this.rn = e.data;
    this.doc();
  }

  updateRow(data: any, action: string = 'update_rn') {
    data.student = this.student.uid;
    if (data.deliberation_date.toLocaleDateString?.()) {
      data.deliberation_date = data.deliberation_date.getFullYear() + '-' + data.deliberation_date.getMonth() + '-' + data.deliberation_date.getDate();
    }

    this.rest.request({ action: action, data: data }).then(
      (result: any) => {
        if (result.code && result.code === 200) {
          if (action == 'add_rn') {
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
   * Suppresson d'un relevé de notes.
   * @param e
   */
  onRowRemoved(e: any) {
    if (e.data.id) {
      this.rest.request({ action: "remove_rn", rnid: e.data.id }).then(
        (result: any) => {
          if (result.code && result.code === 200) {
            this.notifyService.notify(new Success('Suppessin terminée avec succès'));
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
        sortIndex: 15,
        options: {
          icon: 'checklist',
          text: 'Fiches'
        }
      });
  }

  doc() {
    // Select notes
    this.rest.request({ action: "notes", rnid: this.rn.id }).then(
      (result: any) => {
        if (result.list) {
          let notes = result.list;
          this.rest.prepare(this.student, new Releve('', '', { rn: this.rn, matters: this.matters, notes: notes })).then(
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
    );
  }
}
