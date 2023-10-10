import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PictogramService {
  pictograms = {
    "tag": '👤',
    "like": '👍',
    "comment": '💬',
    "calendar": '📅'
  };

  constructor() {
  }
}
