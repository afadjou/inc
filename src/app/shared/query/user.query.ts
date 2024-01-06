import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserQuery {

  constructor() { }

  /**
   * Selectionne l'utilisateur stocké en base FireStore.
   *
   * @param authUser
   */
  public select(authUser: any) {

  }
  /**
   * Fetch all users
   * @returns
   */
  public fetchAll() {

  }

  /**
   * Retourne une reference de l'utisateur.
   * @param authUser
   */
 public getUser(authUser: any) {

 }
 public getUserByUID(uid: string) {

}
  /**
   * Ajout un objet PSO à l'utilisateur.
   *
   * @param user
   * @param pso
   */
  public addPso(user: any, pso: PushSubscription) {

  }

  /**
   * Supprime l'objet PSO de l'utilisateur.
   *
   * @param user
   */
  public removePso(user: any) {

  }

  /**
   *
   * @param email Check if Mail exists.
   *
   */
  public checlExistByMail(email: string) {

  }
}
