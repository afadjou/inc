import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { NotifyService } from '../notify/services/notify.service';
import { Success } from '../notify/success';
import { Error } from '../notify/error';
import { confirm } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root'
})
export class DbQueryService {

  constructor(private afs: AngularFirestore, private notifyService: NotifyService) { }
  /**
   * Ajout d'un document
   * @param path
   * @param data
   */
  insert(path: string, data: any) {
    const dataRef: AngularFirestoreDocument<any> = this.afs.doc(
      path
    );

    // Ajout de l'auteur et de la date.
    const u = localStorage.getItem('user') ?? '';
    if (u) {
      const auth: any = JSON.parse(u);
      data.author = auth.uid;
      data.date = new Date();
    }
    dataRef.set(data, { merge: true}).then(
      (r) => {
        this.notifyService.notify(new Success('Vos données ont été ajoutées avec succès.'))
      },
      (error: any) => {
        this.notifyService.notify(new Error("Nous avons rencontré un problème lors de l'insersion."))
      }
    );
  }

  /**
   * Modification d'un document.
   *
   * @param path
   * @param data
   */
  update(path: string, data: any) {
    const dataRef: AngularFirestoreDocument<any> = this.afs.doc(
      path
    );

    // Ajout de l'auteur et de la date.
    const u = localStorage.getItem('user') ?? '';
    if (u) {
      const auth: any = JSON.parse(u);
      data.author = auth.uid;
      data.date = new Date();
    }
    dataRef.set(data, { merge: true}).then(
      (r) => {
        this.notifyService.notify(new Success('Vos données ont été mise à jour avec succès.'))
      },
      (error: any) => {
        this.notifyService.notify(new Error("Nous avons rencontré un problème lors de la mise à jour."))
      }
    );
  }
  /**
   * Suppresion d'un document
   * @param path
   */
  delete(path: string) {
    return new Promise(
      (resolve, reject) => {
        confirm('Vous êtes sur le point de supprimer cette donnée; Confirmez-vous ?', 'Alert - Suppression').then(
          (r: boolean) => {
            const dataRef: AngularFirestoreDocument<any> = this.afs.doc(
              path
            );
            dataRef.delete().then(
              () => {
                resolve(true);
                this.notifyService.notify(new Success('Vos données ont été supprimées avec succès.'))
              },
              (error: any) => {
                reject(error);
                this.notifyService.notify(new Error("Nous avons rencontré un problème lors de la suppression."))
              }
            )
          }
        )
      }
    );
  }
  /**
   * Selection d'une collection
   * @param path
   * @returns
   */
  select(path: string): AngularFirestoreCollection {
    return this.afs.collection(path);
  }
  /**
   * Envoi d'une requette
   * @param path
   * @param close
   * @returns
   */
  query(path: string, close: any) {
    close.limite = close.limite ?? 50;
    if (close.key && close.value && close.limite) {
      return this.afs.collection<any>(path, ref => ref.where(close.key, close.op, close.value).limit(close.limite));
    }

    return undefined;
  }
}
