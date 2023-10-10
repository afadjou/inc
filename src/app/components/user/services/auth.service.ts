import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {NotifyService} from "../../../shared/notify/services/notify.service";
import {Error} from "../../../shared/notify/error";
import {Info} from "../../../shared/notify/info";
import { UserQuery } from '../../../shared/query/user.query';
import { Success } from 'src/app/shared/notify/success';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public notifyService: NotifyService,
    public userQuery: UserQuery
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
    return this.afAuth.signInWithEmailAndPassword(email, passWord)
      .then((result) => {

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.setSessionUser(user).then(
              () => {
                this.router.navigate(['dashboard']).then(
                  () => {
                    location.reload();
                  }
                );
              }
            );
          }
        });
      })
      .catch((error) => {
        this.notifyService.notify(new Error(error.message));
      });
  }

  signUp (email: string, passWord: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, passWord)
      .then((result) => {
        this.SendVerificationMail().then();
        this.setUserData(result.user).then();
      })
  }
  /**
   * Maj de l'utilistateur dans le firestoreDocument.
   *
   * @param user
   * @private
   */
  public setUserData(user: any) {
    return new Promise(
      (resolve, reject) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `users/${user.uid}`
        );

        userRef.valueChanges().subscribe(
          (u: any) => {
            let displayName: any[] = user.displayName.split(' ');
            let userData: any = {
              uid: user.uid,
              email: user.email,
              name: displayName.at(displayName.length - 1),
              firstName: displayName.slice(0, (displayName.length - 1)).join(' '),
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              lastSignInTime: user.metadata.lastSignInTime
            };

            userData.role = u && u.role ? u.role : 'ANONYMOUS_ROLE';
            localStorage.setItem('user', JSON.stringify(userData));

            // Cette ligne est à supprimer et remplacer par le choix de l'utilisateur lors de sa connexion.
            localStorage.setItem('part_domain', JSON.stringify({ part: 'EDUC-2023-06-17-000', domain: 'DOM-2023-06-17-000'}));

            userRef.set(userData, {
              merge: true,
            }).then();

            resolve(true);
          }
        );
      }
    );
  }

  public setSessionUser(user: any) {
    return new Promise(
      (resolve, reject) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `users/${user.uid}`
        );

        userRef.valueChanges().subscribe(
          (u: any) => {
            u.role = u && u.role ? u.role : 'ANONYMOUS_ROLE';
            localStorage.setItem('user', JSON.stringify(u));

            // Cette ligne est à supprimer et remplacer par le choix de l'utilisateur lors de sa connexion.
            localStorage.setItem('part_domain', JSON.stringify({ part: 'EDUC-2023-06-17-000', domain: 'DOM-2023-06-17-000'}));
            resolve(true);
          }
        );
      }
    );
  }
/**
 *
 * @param user Création nouvel utilisateur.
 *
 */
  public createUser(user: any) {

    // Création du comp^te d'authentification

    this.afAuth.createUserWithEmailAndPassword(user.email, 'Password2023*').then(
      (r) => {
        if (r.user) {
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(
            `users/${r.user.uid}`
          );

          user.uid = r.user.uid;

          userRef.set(user, { merge: true}).then();
          r.user.sendEmailVerification().then();
          this.notifyService.notify(new Success('Le compte est crée avec succès'));
        }
      }
    );


  }
  /**
   * Mise à jour de la fiche utulisateur
   * @param user
   */
  public updateUser(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
     '/users/' + user.uid
    );
    userRef.set(user, { merge: true }).then(
      (r) => {
        this.notifyService.notify(new Success('La fiche utilisateurs à été mise à jour avec succès.'));
      },
      (error: any) => {
        this.notifyService.notify(new Error('La mise à jour de la fiche utilisateur a echoué.'))
      }
    );
  }

  /**
   * Methode de suppression d'un utilisateur.
   * Cette méthode ne supprime pas le compte d'authentification, mais le compte d données associé.
   *
   * @param uid
   */
  public deleteUser(uid: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      '/users/' + uid
    );

    userRef.delete().then(
      (r) => {
        this.notifyService.notify(new Success("L'utilisateur a bien été supprimé."));
      },
      (error: any) => {
        this.notifyService.notify(new Error("Un problème a eu lieu lors de la suppression de l'utilisateur."))
      }
    );
  }
  /**
   * Envoi un mailde vérification del'adresse email si c'est un nouvel utilisateur.
   *
   * @constructor
   * @private
   */
  public SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']).then();
      })
  }

  /**
   * Fonction de réinitialisation de mot de passe.
   *
   * @param passWordResetEmail
   */
  forgotPassWord(passWordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passWordResetEmail)
      .then(() => {
        this.notifyService.notify(new Info('Un mail de réinitialisation a été envoyé à l\'adresse saisie. Consulter votre boite email.'));
      })
      .catch((error) => {
        this.notifyService.notify(new Error(error.message));
      })
  }

  /**
   * Vérifie si un utilisateur est connecté.
   */
  get isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }

  /**
   * Fonction de déconnexion.
   */
  signOut() {
    return this.afAuth.signOut()
      .then(() => {
        localStorage.setItem('user', 'null');
        this.router.navigate( ['/']).then(
          () => {
             window.location.href = '/';
          }
        );
      })
  }
  /**
   * Connexion avec un comte google.
   *
   */
  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider())
      .then((response: any) => {
        this.router.navigate(['dashboard']).then();
      })
  }
  /**
   * Connexion avec un comte Microsoft.
   *
   */
  msmAuth() {
    return this.authLogin(new auth.OAuthProvider('microsoft.com'))
      .then((response: any) => {
        this.router.navigate(['dashboard']).then();
      })
  }
  /**
   * Connexion avec un fournisseur.
   *
   * @param provider
   */
  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user).then(
          (r) => {
            this.router.navigate(['dashboard']).then(
              () => {
                location.reload();
              }
            );
          }
        );
      })
      .catch((error) => {
        this.notifyService.notify(new Error(error.message));
      })
  }
  /**
   * Vérifie si l'adresse email existe
   */
  mailExists(email: string) {
    return this.userQuery.checlExistByMail(email);
  }
}
