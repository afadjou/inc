import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  administrators: any[] = [];
  userSubscribe: any;
  searchTerms = ['ADMIN_ROLE'];
  constructor(private uq: UserQuery) { }

  ngOnInit(): void {
    this.uq.fetchAll().valueChanges().subscribe(
      (users) => {
        this.administrators = users.filter(
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
  }

}
