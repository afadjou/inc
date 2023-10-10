import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {DbQueryService} from "../../shared/query/db.query.service";
import {FormBuilder} from "@angular/forms";
import {max} from "rxjs";
import {maxWorkers} from "@angular-devkit/build-angular/src/utils/environment-options";

@Component({
  selector: 'app-dashboard-examens',
  templateUrl: './dashboard-examens.component.html',
  styleUrls: ['./dashboard-examens.component.scss']
})
export class DashboardExamensComponent implements OnInit{

  rns: any[] = [];
  results: any[] = [];
  sessions: any[] = [];
  current_session: any;

  path: string = '';
  constructor (private db: DbQueryService, private subject: SubjectService) {}

  ngOnInit() {
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter(shutter);

    this.path = 'shutters/' + shutter + '/rn';

    // Liste des matières.
    this.db.select(this.path).valueChanges().subscribe(
      (rns: any[]) => {

        this.rns = rns;
        // Recupération des sessions
        let session = 0;
        rns.forEach(
          (row: any) => {
            if (!this.sessions.includes(row.session)) {
              this.sessions.push(row.session);
              session = row.session > session ? row.session : session;
            }
          }
        );

        if (session) {
          this.current_session = session;
          this.results = rns.filter(
            (rn: any) => {
              return rn.session == session;
            }
          );
        }
      }
    );
  }

  onSelectionChanged(e: any) {
    if (e.selectedItem && e.selectedItem != this.current_session) {
      this.current_session = e.selectedItem;
      this.results = this.rns.filter(
        (row: any) => {
          return row.session == e.selectedItem;
        }
      );
    }
  }
}
