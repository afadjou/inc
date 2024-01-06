import { Injectable } from '@angular/core';
import {Message} from "../message";
import notify from 'devextreme/ui/notify';
import {NotifyQuery} from "../../query/notify.query";
import {SwPush} from "@angular/service-worker";
import {UserQuery} from "../../query/user.query";
import {Warning} from "../warning";
import {Error} from "../error";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  readonly VAPID_PUBLIC_KEY = "BCZTm2xkpFXOVikGPb-fjEOCZLPZ6ikyasb74xSv9KWnhZcDUMiEFCUWDBG5Ve7_39gq3VyoTz69_CllfBfrHgE";
  constructor(private swPush: SwPush, private notifyQuery: NotifyQuery, private userQuery: UserQuery) { }

  /**
   * Exécute l'affichage de la notification.
   *
   * @param notification
   */
  public notify (notification: Message) {
    notify({
      'message': notification.code ? notification.code + ' : ' + notification.message : notification.message,
      'width': notification.width,
      'height': notification.height,
      'position': notification.position
    }, notification._type, notification._duration);
  }

  /**
   * Fait la souscription aux notifications.
   *
   * @param user
   */
  public subscription(user: any) {
    /*
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(ps => this.userQuery.addPso(user, ps).catch(err => this.notify(new Error(err.message))))
      .catch(err => this.notify(new Error(err.message)));*/
  }

  /**
   * Supprime l'enregistrement aux notifications.
   *
   * @param user
   */
  public unsubscription(user: any) {
    this.swPush.unsubscribe()
      .then()
      .catch(error => {});

    // Mise à jour sur la p^lateforme
    /*this.userQuery.removePso(user).then(() => this.notify(new Warning('Vous venez de vous désinscrire pour recevoir des notifications')))
      .catch(err => this.notify(new Error(err.message)));*/
  }

}
