import {Component, OnInit, OnDestroy, Injectable} from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {ListService} from "../../../shared/tools/list.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
@Injectable()
export class UsersListComponent implements OnInit {
  users: any[] = [];
  searchTerms: any[] = [''];
  constructor(private uq: UserQuery, private subject: SubjectService, private listService: ListService) {
    this.listService.rols().forEach(
      (role: any) => {
        this.searchTerms.push(role.id);
      }
    );
  }

  ngOnInit(): void {
    this.uq.fetchAll().valueChanges().subscribe(
      (users) => {
        this.users = users;
      }
    );
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter(shutter);
  }

}
