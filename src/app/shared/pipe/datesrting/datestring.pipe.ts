import { Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'datestring'
})
export class DatestringPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return value instanceof Date ? value.toLocaleDateString() : value;
  }

}
