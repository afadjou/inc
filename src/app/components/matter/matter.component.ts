import { Component, OnInit } from '@angular/core';
import { DbQueryService } from 'src/app/shared/query/db.query.service';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {ListService} from "../../shared/tools/list.service";

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: [
    './matter.component.scss',
    '../../../assets/themes/scss/base/_grid.scss'
  ]
})
export class MatterComponent implements OnInit {
  shutter: string = localStorage.getItem('shutter_id') ?? '';
  path: string = '';
  matters: any[] = [];
  serials: any[] = [];
  labels: any[] = [];
  constructor (private subject: SubjectService, private db: DbQueryService, private listService: ListService) {
    this.path = '/shutters/' + this.shutter + '/matters/';
    this.serials = this.listService.serials();
    this.labels = this.listService.matters();
  }

  ngOnInit(): void {
    this.db.select(this.path).valueChanges().subscribe(
      (matters: any[]) => {
        this.matters = matters;
      }
    );
    this.subject.emitShutter(this.shutter);
  }

  alterDataGriOperation($event: any) {
    // TODO
  }

  onRowRemove(event: any) {
    const cible = this.path + event.data.mid;
    this.db.delete(cible).then();
  }

  onRowInserting(event: any) {
   this.onRowUpdating(event);
  }

  onRowUpdating(event: any) {
    let data: any;
    if (event.data && event.data.mid) {
      data = event.data;
      data.mid = event.data.mid;
    } else if (event.oldData && event.oldData.mid) {
      data = event.newData;
      data.mid = event.oldData.mid;
    }

    const cible = this.path + data.mid;
    this.db.insert(cible, data);

  }

  onCellPrepared(event: any) {
    if (event.columnIndex == 0 && (event.data && !event.data.mid)) {
      event.data.mid = event.key;
    }
  }

}
