import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./components/user/services/auth.service";
import {UserQuery} from "./shared/query/user.query";
import {NotifyService} from "./shared/notify/services/notify.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inc';
  currentUser: any;
  login: boolean = false;
  panelSubscription: any;
  @Input() dashboard = {
    sm: 'ml-sm-auto',
    md: 'col-md-12',
    lg: 'col-lg-12'
  };
  @Input() sidebar = {
    sm: '',
    collapse: '',
  };

  constructor(private authService: AuthService, private notifyService: NotifyService, private userQuery: UserQuery) {
    this.authService.afs.firestore.enablePersistence().then();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.login = true;
      const user = JSON.parse(localStorage.getItem('user')!);
      if (user) {
        this.userQuery.getUser(user).get().forEach(next => {
          this.notifyService.subscription(user);
        }).then();
      }
    } else {
      this.login = false;
    }
  }
  ngOnDestroy(): void {
    this.panelSubscription.unsubscribe();
  }
}
