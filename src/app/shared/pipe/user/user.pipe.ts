import { Pipe, PipeTransform } from '@angular/core';
import {UserQuery} from "../../query/user.query";

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(private uq: UserQuery) {}
  transform(value: any, ...args: unknown[]): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.uq.getUserByUID(value).valueChanges().subscribe(
          (u: any) => {
            resolve(u.firstName + ' ' + u.name);
          }
        );
      }
    );
  }

}
