import { Component, OnInit } from '@angular/core';
import { DbQueryService } from 'src/app/shared/query/db.query.service';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {ListService} from "../../shared/tools/list.service";
import {RestService} from "../../shared/tools/rest.service";
import {NotifyService} from "../../shared/notify/services/notify.service";
import {Error} from "../../shared/notify/error";
import {Success} from "../../shared/notify/success";

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
  constructor (
    private subject: SubjectService,
    private restService: RestService,
    private listService: ListService,
    private notifyService: NotifyService
  ) {
    this.path = '/shutters/' + this.shutter + '/matters/';

    // Liste des séries
    this.restService.request({ action: "series" }).then(
      (result: any) => {
        if (result.list) {
          this.serials = result.list;
        }
      }
    );

    // Liste des libelés matières
    this.restService.request({ action: "matters_labels" }).then(
      (result: any) => {
        if (result.list) {
          this.labels = result.list;
        }
      }
    );
  }

  ngOnInit(): void {
    this.restService.request({ action: "matters" }).then(
      (result: any) => {
        if (result.list) {
          this.matters = result.list;
        } else {
          this.notifyService.notify(new Error(result.message, 'error', 3000));
        }
      }
    );
    this.subject.emitShutter(this.shutter);
  }

  alterDataGriOperation($event: any) {
    // TODO
  }

  onRowRemove(event: any) {
    this.restService.request({ action: "remove_matter", mid: event.data.id }).then(
      (result: any) => {
        if (result.code && result.code === 200) {
          this.notifyService.notify(new Success('Suppression terminée avec succès'));
        } else {
          this.notifyService.notify(new Error(result.message, 'error', 3000));
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 3000));
      }
    );
  }

  onRowInserting(event: any) {
    let data: any = event?.data;
   this.updateRow(data, 'add_matter');
  }

  onRowUpdating(event: any) {
    let data: any = event?.oldData;
    const newData: any = event.newData;
    const newKeys: any[] = Object.keys(newData);

    newKeys.forEach((d: any) => {
      data[d] = newData[d];
    });

    this.updateRow(data, 'update_matter');
  }
  updateRow(data: any, action: string) {
    this.restService.request({ action: action, data: data }).then(
      (result: any) => {
        if (result.code && result.code === 200) {
          if (action == 'add_matter') {
            data.id = result.data;
            this.notifyService.notify(new Success('Insertion terminée avec succès'));
          } else {
            this.notifyService.notify(new Success('Mise à jour terminée avec succès'));
          }
        } else {
          this.notifyService.notify(new Error(result.message, 'error', 3000));
        }
      },
      (error: any) => {
        this.notifyService.notify(new Error(error.error.message, 'error', 3000));
      }
    );
  }
}
