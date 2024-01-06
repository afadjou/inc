import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {DbQueryService} from "../../shared/query/db.query.service";
import {RestService} from "../../shared/tools/rest.service";
import CustomStore from "devextreme/data/custom_store";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit{
  constructor (private subject: SubjectService, private restService: RestService, private db: DbQueryService) {}
  searchTerms = ['etudiant'];
  students: any;

  ngOnInit(): void {
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.students = new CustomStore({
      load: (data) => {
        return new Promise((resolve, reject) => {
          this.restService.request({ action: "students" }).then(
            (result: any) => {
              if (result.list) {
                resolve(result.list);
              }
            }
          );
        });
      }
    });
    this.subject.emitShutter(shutter);
  }
}
