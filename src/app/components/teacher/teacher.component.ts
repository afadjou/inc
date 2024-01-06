import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {RestService} from "../../shared/tools/rest.service";
import CustomStore from "devextreme/data/custom_store";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  constructor (private subject: SubjectService, private restService: RestService) {}
  searchTerms = ['enseignant'];
  teachers: any;

  ngOnInit(): void {
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.teachers = new CustomStore({
      load: (data) => {
        return new Promise((resolve, reject) => {
          this.restService.request({ action: "teachers" }).then(
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
