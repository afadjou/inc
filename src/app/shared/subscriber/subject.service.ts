import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  observable =  new Subject<any[]>;

  /**
   * Restitue le volet à l'observateur.
   * @param shutter
   */
  emitShutter(shutter: string) {
    this.observable.next([shutter].slice());
  }
}
