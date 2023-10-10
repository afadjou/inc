import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
declare global { interface Window { AdobeDC: any; } }

@Injectable({
  providedIn: 'root'
})
export class ViewSdkService {

  readyPromise: Promise<any> = new Promise((resolve, reject) => {
    if (window.AdobeDC) {
      resolve(true);
    } else {
      /* Wait for Adobe Document Services PDF Embed API to be ready */
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        resolve(true);
      });
    }
  });
  adobeDCView: any;
  constructor() { }

  ready() {
    return this.readyPromise;
  }

  /**
   * Covert base64 to ArrayBuffer
   * @param base64
   */
  base64ToArrayBuffer(base64: string) {
    var bin = window.atob(base64);
    var len = bin.length;
    var uInt8Array = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      uInt8Array[i] = bin.charCodeAt(i);
    }
    return uInt8Array.buffer;
  }
  previewFile(divId: string, viewerConfig: any, base64: string){
    const config: any = {
      clientId: environment.api.token
    };
    if (divId) {
      config.divId = divId;
    }
    this.adobeDCView = new window.AdobeDC.View(config);
    this.adobeDCView.previewFile({
      content: {
        promise: Promise.resolve(this.base64ToArrayBuffer(base64)),
      },
      metaData: {
        /* file name */
        fileName: 'RELEVE DE NOTES.pdf',
      }
    }, viewerConfig);
  }
}
