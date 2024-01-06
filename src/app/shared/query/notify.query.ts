import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class NotifyQuery {

  constructor() { }

  /**
   *
   * @param limit
   */
  select(limit: number = 7) : null {
    return null;
  }

  /**
   * Selectionne toutes les notifications.
   */
  public infos(): null {
    return null;
  }

  /**
   * Selectionne toutes les notifications non lu.
   */
  public infosNoChecked() : null {
    return null;
  }
  /**
   * Met à jour la notification.
   *
   * @param notification
   */
  public update(notification: any) {
    return null;
  }
}
