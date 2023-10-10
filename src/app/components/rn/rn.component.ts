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
    let path_matters = '/shutters/' + this.shutter + '/matters/';
    this.serials = this.listService.serials();

    // Liste des matières.
    this.db.select(path_matters).valueChanges().subscribe(
      (matters: any[]) => {
        this.matters = matters;
      }
    );

    // Etudiant -chargement
    const uid = this.route.snapshot.params['uid'];
    if (uid) {
      this.uq.getUserByUID(uid).valueChanges().subscribe(
        (user: any) => {
          let dte = user.birthday && user.birthday.seconds ? new Date(user.birthday.seconds * 1000) : new Date();
          user.birthday = dte;
          this.student = user;
        }
      );
    }

    // Relevés de notes chargement
    this.db.query(this.path, { key: 'uid', op: '==', value: uid})?.valueChanges().subscribe(
      (rns: any[]) => {
        if (rns) {
          rns.forEach(
            (r: any) => {
              r.deliberation_date = r.deliberation_date?.seconds ? new Date((r.deliberation_date?.seconds * 1000) + (r.deliberation_date?.nanoseconds / 1000)) : '';
            }
          );
          this.rns = rns.sort((a: any, b: any) => {
            return b.type.localeCompare(a.type);
          });
          this.rn = this.rn ?? this.rns.at(0);
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
    if (this.student) {
      e.data.uid = this.student.uid;
      this.onRowUpdated(e);
      e.component.addRow();
    }
  }

  /**
   * Modification d'un rlevé de notes.
   * @param e
   */
  onRowUpdated(e: any) {
    const now = new Date();
    if (e.data.deliberation_date && e.data.deliberation_date <= now) {
      this.notifyService.notify(new Warning('Cette fiche est fermée, vous ne pouvez pas la modifier !'));
      return;
    }
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

    // Regenration editique
    this.rn = data;
    this.doc();
  }

  /**
   * Suppresson d'un relevé de notes.
   * @param e
   */
  onRowRemoved(e: any) {
    if (e.data.id) {
      let p = this.path + e.data.id;

      // Suppression de la collection des notes
      this.db.delete(p + '/notes/*').then(
        () => {
          // Suppression du relevé
          this.db.delete(p);
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
    let cible = this.path + this.rn?.id + '/notes/';
    this.db.select(cible).valueChanges().subscribe(
      (notes: any[]) => {
        this.rest.prepare(this.student?.uid, new Releve('', '', { rn: this.rn, matters: this.matters, notes: notes })).then(
          (doc: any) => {
            const error_message: string = '<p>Nous avons rencontré un problème lors de la génération du document.</p>';
            this.rest.send(doc).then(
              (response: any) => {
                if (!Array.isArray(response) && response.releves_notes && response.releves_notes.errorCode == 0) {
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
    );
  }
}
