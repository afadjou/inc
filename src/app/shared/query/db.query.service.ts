import { Injectable } from '@angular/core';
import { NotifyService } from '../notify/services/notify.service';
import { Success } from '../notify/success';
import { Error } from '../notify/error';
import { confirm } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root'
})
export class DbQueryService {

  constructor(private notifyService: NotifyService) { }
  /**
   * Ajout d'un document
   * @param path
   * @param data
   */
  insert(path: string, data: any) {
  }

  /**
   * Modification d'un document.
   *
   * @param path
   * @param data
   */
  update(path: string, data: any) {
  }
  /**
   * Suppresion d'un document
   * @param path
   */
  delete(path: string) {
  }
  /**
   * Selection d'une collection
   * @param path
   * @returns
   */
  select(path: string) {
    //return this.afs.collection(path);
  }
  /**
   * Envoi d'une requette
   * @param path
   * @param close
   * @returns
   */
  query(path: string, close: any) {
    return undefined;
  }
}
