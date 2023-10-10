import { Pipe, PipeTransform} from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
@Pipe({
  name: 'delay'
})
export class DelayPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    let date = new Date((value.seconds * 1000));
    let now = new Date();
    let interval = now.getTime() - date.getTime();

    // En heures.
    let delay = Math.round(interval / (1000*60));
    let unity = delay > 1 ? 'minutes' : 'minute';

    // En heure
    if (delay > 60) {
      delay = Math.round(delay / 60);
      unity = delay > 1 ? 'heures' : 'heure';
    }

    // En jours
    if (delay > 23) {
      delay = Math.round(delay / 24);
      unity = delay > 1 ? 'jours' : 'jour';
    }

    // En mois
    if (delay > 30) {
      delay = Math.round(delay / 30);
      unity = 'mois';
    }

    // En années.
    if (delay > 11) {
      delay = Math.round(delay / 12);
      unity = delay > 1 ? 'ans' : 'an';
    }

    return delay + ' ' + unity;
  }

}
