import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData
} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class NotifyQuery {

  constructor(private afs: AngularFirestore) { }

  /**
   *
   * @param limit
   */
  select(limit: number = 7) : AngularFirestoreCollection | null {
    let partDomain = JSON.parse(localStorage.getItem('part_domain')!);
    if (partDomain && partDomain.part && partDomain.domain) {
      return this.afs.collection('part')
        .doc(partDomain.part).collection(partDomain.domain)
        .doc('notifications')
        .collection('logs', ref => ref.where('type', '==', 'info').orderBy('created', 'desc').limit(limit));
    }

    return null;
  }

  /**
   * Selectionne toutes les notifications.
   */
  public infos() : AngularFirestoreCollection | null {
    let partDomain = JSON.parse(localStorage.getItem('part_domain')!);
    if (partDomain && partDomain.part && partDomain.domain) {
      return this.afs.collection('part')
        .doc(partDomain.part).collection(partDomain.domain)
        .doc('notifications')
        .collection('logs', ref => ref.where('type', '==', 'info').orderBy('created', 'desc'));
    }

    return null;
  }

  /**
   * Selectionne toutes les notifications non lu.
   */
  public infosNoChecked() : AngularFirestoreCollection | null {
    let partDomain = JSON.parse(localStorage.getItem('part_domain')!);
    if (partDomain && partDomain.part && partDomain.domain) {
      return this.afs.collection('part')
        .doc(partDomain.part).collection(partDomain.domain)
        .doc('notifications')
        .collection('logs', ref => ref.where('type', '==', 'info').where('status', '==', true).orderBy('created', 'desc'));
    }

    return null;
  }
  /**
   * Met à jour la notification.
   *
   * @param notification
   */
  public update(notification: any) {
    let partDomain = JSON.parse(localStorage.getItem('part_domain')!);
    if (partDomain && partDomain.part && partDomain.domain) {
      const afsd: AngularFirestoreDocument<any> = this.afs.doc(
        `part/${partDomain.part}/${partDomain.domain}/notifications/logs/${notification.id}`
      );

      return afsd.set(notification, {
        merge: true
      });
    }

    return null;
  }
}
