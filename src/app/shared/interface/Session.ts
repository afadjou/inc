import {UserQuery} from "../query/user.query";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class Session {
  public user: any;
  constructor(private userQuery: UserQuery) {
    const usr = localStorage.getItem('user');
    if (usr) {
      const u: any = JSON.parse(usr);
      this.user = u;
    }
  }
}
