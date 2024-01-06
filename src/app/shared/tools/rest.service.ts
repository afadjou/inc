import { Injectable } from '@angular/core';
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
  constructor(private uq: UserQuery, private httpClient: HttpClient) {
    const credentials = environment.editing.uid + ':' + environment.editing.pwd;
    this.options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64_encode(credentials)
      })
    };
  }

  /**
   * Prepare les données à envoyer pour la génération du document.
   * @param uid
   */
  prepare(user: any, doc: Editique) {
    return new Promise(
      (resolve, reject) => {
        if (user) {
          this.user = user;
          doc.prepare(user);
          if (doc.errors.length == 0) {
            resolve(doc);
          } else {
            reject (doc.errors);
          }
        }
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

  /**
   * Fait un appel vers le BO.
   *
   * @param request
   */
  request(request: any, options: any = null) {
    const storageCredentials = localStorage.getItem('credentials') !== 'null' ? localStorage.getItem('credentials') : null;
    const credentials = options?.credentials ?? storageCredentials;

    const h =  credentials ? {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + credentials
      })
    } : this.options;
    return new Promise(
      (resolve, reject) => {
        this.httpClient.post(environment.rest.host + 'api/v1/post', request, h).subscribe(
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
