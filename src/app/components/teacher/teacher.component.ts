import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  constructor (private subject: SubjectService, private uq: UserQuery) {}
  searchTerms = ['TEACHER_ROLE'];
  teachers: any[] = [];

  ngOnInit(): void {
    this.uq.fetchAll().valueChanges().subscribe(
      (users) => {
        this.teachers = users.filter(
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
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter(shutter);
  }
}
