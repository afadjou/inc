import { Injectable } from '@angular/core';
import {Router, RouterModule} from "@angular/router";

import {AppRoutingModule, routes } from "../../app-routing.module";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private router: Router) { }

  /**
   * Vérifie si le rôle de l'utilisateur connecté ait accès à la route chargée.
   *
   * @param auth
   * @param route
   */
  checkUser(auth: any, route: any): any {
    const permissions: any[] = route.data.roles;

    if (permissions && !permissions.includes('*')) {
      let roles: any[] = [];
      auth.roles.forEach((role: any) => {
        if (route.data.roles.includes(role.id)) {
          roles.push(role.id);
        }
      });
      if (roles.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Vérifie si l'utilisateur connecté a accès au menu.
   * @param auth
   * @param menu
   */
  checkMenuByPath(auth: any, menu: any) {
    if (menu && menu.url) {
      const route: any = routes.filter(
        (r: any) => {
          return (r && r.path == menu.url.join('/'));
        }
      ).at(0);
      if (route) {
        if (route?.data?.roles) {
          let roles: any[] = [];
          auth.roles.forEach((role: any) => {
            if (route.data.roles.includes(role.id)) {
              roles.push(role.id);
            }
          });
          menu.enabled = route.data.roles.includes('*') || roles.length > 0;
        } else {
          menu.enabled = true;
        }
      } else {
        menu.enabled = false;
      }

      // Si des sous-menus
      if (menu.items && menu.items.length > 0) {
        menu.items.forEach(
          (m: any) => {
            this.checkMenuByPath(auth, m);
          }
        );
      }
    } else {
      menu.enabled = true;
    }
  }
}
