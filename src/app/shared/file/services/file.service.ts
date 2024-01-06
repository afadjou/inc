import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() { }

  /**
   *
   * @param file Upload file in FireStore.
   *
   * @param fileName
   */
  uploadFile(file: File, fileName: string = '', burket: string = 'images') {
    return new Promise(
      (resolve, reject) => {
        if (!fileName) {
          fileName = Date.now().toString() + file.name;
        }
        let path = burket + '/' + fileName;
        const storage = getStorage();
        const storageRef = ref(storage, path);
        uploadBytes(storageRef, file).then(
          (snapshot) => {
            getDownloadURL(ref(storage, path)).then(
              (url: any) => {
                resolve(url);
              },
              (error: any) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  downloadFile(url: string) {
    return new Promise(
      (resolve, reject) => {
        const storage = getStorage();
        // const storageRef = ref(storage, url);
        // getBytes(storageRef).then(
        //   (buffer: ArrayBuffer) => {
        //     console.log(buffer);
        //   }
        // );
      }
    );
  }
}
