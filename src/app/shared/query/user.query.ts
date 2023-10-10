import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserQuery {

  constructor(private afs: AngularFirestore) { }

  /**
   * Selectionne l'utilisateur stocké en base FireStore.
   *
   * @param authUser
   */
  public select(authUser: any): AngularFirestoreCollection {
    return this.afs.collection<any>('users', ref => ref.where('uid', '==', authUser.uid)
      .limit(1)
    );
  }
  /**
   * Fetch all users
   * @returns
   */
  public fetchAll() {
    return this.afs.collection<any>('users', ref => ref);
  }

  /**
   * Retourne une reference de l'utisateur.
   * @param authUser
   */
 public getUser(authUser: any) {
   return this.afs.doc(
     `users/${authUser.uid}`
   );
 }
 public getUserByUID(uid: string) {
  return this.afs.doc(
    `users/${uid}`
  );
}
  /**
   * Ajout un objet PSO à l'utilisateur.
   *
   * @param user
   * @param pso
   */
  public addPso(user: any, pso: PushSubscription) {
    const uid = user.uid ?? '_none';
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${uid}`
    );

    user.pso = user.pso ?? [];
    // Vérifie si le endpoint existe déjà
    const index = user.pso.findIndex((ps: any) => {
        const localEndpoint: string = ps.endpoint!;
        const extraEndpoint: string = pso.endpoint!;
        if (localEndpoint == extraEndpoint) {
          return true;
        } else {
          return false;
        }
      }
    );

    if (index == -1) {

      let nPso: any[] = user.pso ?? [];
      nPso.push({
        endpoint: pso.endpoint,
        content: JSON.stringify(pso)
      });

      user.pso = nPso;
    }

    return userRef.set(user, {
      "merge": true
    });
  }

  /**
   * Supprime l'objet PSO de l'utilisateur.
   *
   * @param user
   */
  public removePso(user: any) {
    const uid = user.uid ?? '_none';

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${uid}`
    );

    user.pso = null;
    return userRef.set(user, {
      "merge": true
    });
  }

  /**
   *
   * @param email Check if Mail exists.
   *
   */
  public checlExistByMail(email: string) {

    return new Promise(
      (resolve, reject) => {
        this.afs.collection<any>('users', ref => ref.where('email', '==', email).limit(1)).get().forEach(
          (r) => {
            resolve(!r.empty);
          }
        );
      }
    );
  }
}
