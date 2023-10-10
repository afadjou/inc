import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserQuery} from "../query/user.query";
import {Editique} from "../interface/Editique";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {base64_encode} from "devextreme/data/utils";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  user: any;
  options: any;
  constructor(private afs: AngularFirestore, private uq: UserQuery, private httpClient: HttpClient) {
    const credentials = environment.editing.uid + ':' + environment.editing.pwd;
    this.options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Basic ' + base64_encode(credentials)
      })
    };
  }

  /**
   * Prepare les données à envoyer pour la génération du document.
   * @param uid
   */
  prepare(uid: string, doc: Editique) {
    return new Promise(
      (resolve, reject) => {
        this.uq.getUserByUID(uid).valueChanges().subscribe(
          (user: any) => {
            if (user) {
              this.user = user;
              doc.prepare(user, this.afs);
              if (doc.errors.length == 0) {
                resolve(doc);
              } else {
                reject (doc.errors);
              }
            }
          }
        );
      }
    );
  }

  /**
   * Send request to host
   * @param doc
   */
  send (doc: Editique) {
    return new Promise(
      (resolve, reject) => {
        this.httpClient.post(environment.editing.host + 'api/v1/post', doc.request, this.options).subscribe(
          (response: any) => {
            resolve(response);
          },
          (error: any) => {
            reject(error);
          }
        );
      }
    );
  }
}
