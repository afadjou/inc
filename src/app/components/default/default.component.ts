import { Component, OnInit } from '@angular/core';
import {ShutterService} from "../../shared/shutter/shutter.service";
import {Warning} from "../../shared/notify/warning";
import {NotifyService} from "../../shared/notify/services/notify.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit{

  constructor(public shutterService: ShutterService, public notifyService: NotifyService, private router: Router) {
  }
  ngOnInit(): void {

  }

  onShutterClick(shutter: any) {
    if (!shutter.enabled) {
      this.notifyService.notify(new Warning('Ce volet est actuellement indisponible !'));
      return;
    }

    // sauvegarde du volet actif en session
    localStorage.setItem('shutter_id', shutter.id);
    this.router.navigate(['', { outlets: { dashboard: ['dashboard_' + shutter.id]}}]);
  }
}
