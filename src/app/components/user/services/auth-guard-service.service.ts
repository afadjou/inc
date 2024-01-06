import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterLink, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {PermissionService} from "../../../shared/tools/permission.service";
import {NotifyService} from "../../../shared/notify/services/notify.service";
import {Warning} from "../../../shared/notify/warning";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private permission: PermissionService, private notify: NotifyService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['user', 'login']).then();
    }

    // Vérifie si l'utilisateur connecté a accès à la page.
    const usr = localStorage.getItem('user');
    if (usr) {
      const u: any = JSON.parse(usr);
      if (!this.permission.checkUser(u, route)) {
        this.notify.notify(new Warning('Vous n\'avez pas accès à cette page !'));
        this.router.navigate(['dashboard']).then(
          () => {
            location.reload();
          }
        );
      }
    }

    return true;
  }

}
