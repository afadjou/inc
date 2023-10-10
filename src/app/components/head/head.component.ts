import {Component, OnInit} from '@angular/core';
import {LogoService} from "../../shared/logo/services/logo.service";
import {NotifyQuery} from "../../shared/query/notify.query";
import {UserQuery} from "../../shared/query/user.query";
import { NotifyService } from '../../shared/notify/services/notify.service';
import {AuthService} from "../user/services/auth.service";
import {PictogramService} from "../../shared/pictogram/pictogram.service";
import notify from 'devextreme/ui/notify';
import { Warning } from 'src/app/shared/notify/warning';
import { ShutterService } from 'src/app/shared/shutter/shutter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: [
    './head.component.scss'
  ]
})
export class HeadComponent implements OnInit {
  currentUser: any;
  connectedRoles: any = [];
  actives: any[] = []; // Liste des notificatons non lues à afficher
  noCheckedNotifications: any[] = []; // toutes les notifications non lues
  subscribe: boolean = false;
  collapsed_class: string = 'dropdown-menu dropdown-menu-end navbar-dropdown-caret'
  constructor(
    private router: Router,
    public logoService: LogoService,
    public notifyService: NotifyService,
    public authService: AuthService,
    public notifyQuery: NotifyQuery,
    public userQuery: UserQuery,
    public pictogramService: PictogramService,
    public shutterService: ShutterService,
  ) {
  }

  ngOnInit(): void {
    let sessionUser = JSON.parse(localStorage.getItem('user')!);
    if (sessionUser) {
      this.userQuery.select(sessionUser)
        .valueChanges()
        .subscribe(
          (users) => {
            if (users[0]) {
              this.currentUser = users.at(0);
              if (this.currentUser) {
                this.connectedRoles = this.currentUser.roles;
                if (this.currentUser.pso) {
                  this.subscribe = true;
                  let actives = this.notifyQuery.select();
                  if (actives) {
                    actives.valueChanges().subscribe((actives) => {
                      if (actives) {
                        this.actives = actives;
                      }
                    });
                  }

                  // Compte les les notifications non lues sans limites.
                  let noCheckedNotifications = this.notifyQuery.infosNoChecked();
                  if (noCheckedNotifications) {
                    noCheckedNotifications.valueChanges().subscribe(
                      (list) => {
                        this.noCheckedNotifications = list;
                      }
                    );
                  }
                } else {
                  this.subscribe = false;
                }
              }
            }
          }
        );
    }
  }

  /**
   * Marque la notification comme lue.
   *
   * @param notification
   */
  public updateNotification(notification: any) {
    notification.status = !notification.status;
    this.notifyQuery.update(notification);
  }

  /**
   * Marque toutes les notifications affiché comme lues.
   */
  onReadAll() {
    this.actives.forEach((notification) => {
      notification.status = false;
      this.notifyQuery.update(notification);
    });
  }
  public onSubscribe() {
    this.notifyService.subscription(this.currentUser);
  }

  /**
   * Se désinscrire des notifications.
   */
  public onUnsubscribe() {
    this.notifyService.unsubscription(this.currentUser);
  }
  public onShutterClick(shutter: any) {
    if (!shutter.enabled) {
      this.notifyService.notify(new Warning('Ce volet est actuellement indisponible !'));
      return;
    }

    // Fermeture du paneau des volet ouvert.
    let contenair = document.getElementById('dropdown-menu-caret');
    if (contenair) {
      contenair.classList.remove('show');
    }

    // sauvegarde du volet actif en session
    localStorage.setItem('shutter_id', shutter.id);
    this.router.navigate(['', { outlets: { dashboard: ['dashboard_' + shutter.id]}}]);
  }

  /**
   * Ferme le Pannel Profile utilisateur.
   * @param e
   */
  closePanel(e: any) {
    // Fermeture du paneau des volet ouvert.
    let contenair = document.getElementById('dropdown-profile');
    if (contenair) {
      contenair.classList.remove('show');
    }
  }

  onClipse() {
    let slide_content = document.getElementById('col-content-left');
    let menu = document.getElementById('navbarDefault');
    let chevron_left = document.getElementById('chevrondoubleleft');
    let chevron_right = document.getElementById('chevrondoubleright');

    if (slide_content && menu) {
      if (chevron_right) {
        chevron_right.style.display = 'none'
      }
      if (chevron_left) {
        chevron_left.style.display = 'block';
      }
      slide_content.style.width = "21.9%";
      menu.style.left = "0px";
    }
  }
}

