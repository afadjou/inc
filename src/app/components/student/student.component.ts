import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {DbQueryService} from "../../shared/query/db.query.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit{
  constructor (private subject: SubjectService, private uq: UserQuery, private db: DbQueryService) {}
  searchTerms = ['STUDENT_ROLE'];
  students: any[] = [];

  ngOnInit(): void {
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    let path_rn = 'shutters/' + shutter + '/rn';
    this.uq.fetchAll().valueChanges().subscribe(
      (users) => {
        this.students = users.filter(
          (user) => {
            if (this.searchTerms.includes(user.role)){
              return true;
            }
            else {
              return false;
            }
          }
         );
      }
    );

    this.subject.emitShutter(shutter);
  }
}
