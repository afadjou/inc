import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserQuery } from 'src/app/shared/query/user.query';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.scss']
})
export class SubListComponent implements OnInit {
  subscribers: any[] = [];
  userSubscribe: any;
  searchTerms = ['etudiant', 'enseignant'];
  constructor(private uq: UserQuery) { }

  ngOnInit(): void {
    /*
    this.uq.fetchAll().valueChanges().subscribe(
      (users) => {
        this.subscribers = users.filter(
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
    */
  }
}
