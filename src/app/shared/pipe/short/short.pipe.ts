import { Pipe, PipeTransform} from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
@Pipe({
  name: 'short'
})
export class ShortPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    let len = args[0];
    return value.length > len ? value.substring(0, len) + '..' : value;
  }

}
