import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {NotifyService} from "../../../shared/notify/services/notify.service";
import {Error} from "../../../shared/notify/error";
import {Info} from "../../../shared/notify/info";
import { UserQuery } from '../../../shared/query/user.query';
import { Success } from 'src/app/shared/notify/success';
import {HttpHeaders} from "@angular/common/http";
import {base64_encode} from "devextreme/data/utils";
import {environment} from "../../../../environments/environment";
import {RestService} from "../../../shared/tools/rest.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  constructor(
    public router: Router,
    public notifyService: NotifyService,
    public userQuery: UserQuery,
    public restService: RestService
  ) {
    // this.afAuth.signOut().then();
  }

  /**
   * Fonction de connexion par adresse email + mot de passe.
   *
   * @param email
   * @param passWord
   */
  signIn (email: string, passWord: string) {
    const credentials = email + ':' + passWord;
    return this.restService.request( { action: "sign_in" }, { credentials: base64_encode(credentials) }).then(
      (result: any) => {
        if (result.user) {
          this.setSessionUser(result.user);
          localStorage.setItem('credentials', base64_encode(credentials));
          this.router.navigate(['dashboard']).then();
        } else {
          this.notifyService.notify(new Error('Aucun utilisateur trouvé.', 'error', 5000));
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 5000));
      }
    );
  }

  signUp (email: string, passWord: string) {

  }
  /**
   * Recupère l'utilisateur avec son ID.
   *
   */
  getUser (uid: number) {
    return this.restService.request({ action: "user", uid: uid });
  }
  /**
   * Maj de l'utilistateur dans le firestoreDocument.
   *
   * @param user
   * @private
   */
  public setUserData(user: any) {
  }

  public setSessionUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
/**
 *
 * @param user Création nouvel utilisateur.
 *
 */
  public createUser(user: any) {
      }
  /**
   * Mise à jour de la fiche utulisateur
   * @param user
   */
  public updateUser(user: any) {
    return this.restService.request({ action: "update_user", user: user });
  }

  /**
   * Methode de suppression d'un utilisateur.
   * Cette méthode ne supprime pas le compte d'authentification, mais le compte d données associé.
   *
   * @param uid
   */
  public deleteUser(uid: string) {
    return this.restService.request({ action: "remove_user", uid: uid });
  }
  /**
   * Envoi un mailde vérification del'adresse email si c'est un nouvel utilisateur.
   *
   * @constructor
   * @private
   */
  public SendVerificationMail() {

  }

  /**
   * Fonction de réinitialisation de mot de passe.
   *
   * @param passWordResetEmail
   */
  forgotPassWord(passWordResetEmail: string) {
  }

  /**
   * Vérifie si un utilisateur est connecté.
   */
  get isLoggedIn() {
    const auth = localStorage.getItem('user');
    const user = auth ? JSON.parse(auth) : null;
    return user !== null && user.emailVerified !== false;
  }

  /**
   * Fonction de déconnexion.
   */
  signOut() {
    localStorage.setItem('user', 'null');
    localStorage.setItem('credentials', 'null');
    this.router.navigate( ['/']).then(
      () => {
        window.location.href = '/';
      }
    );
  }
  /**
   * Connexion avec un comte google.
   *
   */
  googleAuth() {

  }
  /**
   * Connexion avec un comte Microsoft.
   *
   */
  msmAuth() {
  }
  /**
   * Connexion avec un fournisseur.
   *
   * @param provider
   */
  authLogin(provider: any) {
  }
  /**
   * Vérifie si l'adresse email existe
   */
  mailExists(email: string) {
    return this.userQuery.checlExistByMail(email);
  }
}
