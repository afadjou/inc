import { Pipe, PipeTransform} from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
@Pipe({
  name: 'todate'
})
export class ToDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): Date {
    let date = value?.seconds ? new Date((value.seconds * 1000) + (value.nanoseconds / 1000)) : new Date();
    return date;
  }

}
