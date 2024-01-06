import {Component, Input, OnInit, Injectable} from '@angular/core';
import {confirm} from 'devextreme/ui/dialog';
import {FormBuilder} from '@angular/forms';
import { UserQuery } from 'src/app/shared/query/user.query';
import { DbQueryService } from 'src/app/shared/query/db.query.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-paginate-table',
  templateUrl: './paginate-table.component.html',
  styleUrls: ['./paginate-table.component.scss']
})
@Injectable()
export class PaginateTableComponent implements OnInit {

  @Input() list: any;
  @Input() searchTerms = [''];
  active_role: string | undefined;
  page = 1;
  count = 0;
  tableSize = 3;
  tableSizeNbr = 3;
  searchForm: any;
  open: boolean = false;
  current_uid: string = '';
  shutter: string = localStorage.getItem('shutter_id') ?? '';
  constructor(
    private formBuilder: FormBuilder,
    private uq: UserQuery,
    private db: DbQueryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.active_role = this.searchTerms.at(0);
    this.initForm();
  }
  initForm(): void {
    this.searchForm = this.formBuilder.group({
      searchField: ['']
    });
  }
  onUserDelete(uid: string): void {
    confirm('Souhaitez-vous supprimer cet utilisateur?', 'Confirmation').then(
      (r: boolean) => {
        if (r === true) {
          this.authService.deleteUser(uid);
        }
      },
    );
  }
  onTableDataChange(e: any): void {
    this.page = e;
    const currentPages = (this.page - 1) * this.tableSize;
    this.tableSizeNbr = (
      (this.list.length - currentPages) < (this.tableSize)) ?
      (this.list.length - ((this.page - 1) * this.tableSize)) :
      (this.page * this.tableSize);
  }
  onSearch(e: Event): void {
    const searchValue = this.searchForm.value.searchField;
    let l = localStorage.getItem('init_list');

    if (l) {
      const users: any[] = JSON.parse(l);
      this.list = users.filter(
        (user) => {
          const regExp = new RegExp(searchValue, 'gi');
          if ((regExp.exec(user.name)?.index !== undefined) ||
            (regExp.exec(user.firstName)?.index !== undefined) ||
            (regExp.exec(user.email)?.index !==  undefined) ||
            (regExp.exec(user.city)?.index !== undefined) ||
            (regExp.exec(user.cne)?.index !== undefined) ||
            (regExp.exec(user.country)?.index !== undefined) ||
            (regExp.exec(user.phoneNumber)?.index !== undefined) ||
            (regExp.exec(user.serial)?.index !== undefined) ||
            (regExp.exec(user.zip)?.index !== undefined)
          ) {
            return true;
          }else {
            return false;
          }
        }
      );

      if (!searchValue) {
        this.list = users;
      }
    }
  }
  /**
   * Traitement des bouttons
   * @param uid
   * @param button
   */
  onAction(uid: string, button: any) {
    if (button.target) {
      const date = new Date();
      switch(button.target) {
        case 'transcript_plus':
          let id = Math.random();
          const rn: any = {
            id: id,
            uid: uid,
            session: date.getFullYear()
          };
          let path = 'shutters/examens/rn/' + id;
          this.db.insert(path, rn);

          break;
        case 'transcript_edit':
          this.current_uid = uid;
          this.open = true;
          break;
        case 'transcript_del':
          break;
        case 'transcript_view':
          break;
        default:
          break;
      }
    }
  }
}
