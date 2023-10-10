import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShutterService } from 'src/app/shared/shutter/shutter.service';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {PermissionService} from "../../shared/tools/permission.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  active_shutter: any = 'default';
  menus: any[] = [];
  main: any;
  default_menu: any[] = [];
  watcher: any;
  date: any;
  user: any;

  constructor (private subject: SubjectService, private shutterService: ShutterService, public permission: PermissionService) {
    this.main = this.shutterService.getShutters().filter(
      (shu: any) => {
        if (shu.id == this.active_shutter) {
          return true;
        } else {
          return false;
        }
      }
    ).at(0);

    this.date = new Date();
    const usr = localStorage.getItem('user');
    if (usr) {
      this.user = JSON.parse(usr);
      this.main.items.forEach((m: any) => {
        this.permission.checkMenuByPath(this.user, m);
      });
    }

    this.menus = this.main ? this.main.items : [];
    this.default_menu = this.menus;
  }

  ngOnInit(): void {
    this.watcher = this.subject.observable.subscribe(
      (shutter: any[]) => {
        this.active_shutter = shutter.at(0).toString();
        this.main = this.shutterService.getShutters().filter(
          (shu: any) => {
            if (shu.id == this.active_shutter) {
              return true;
            } else {
              return false;
            }
          }
        ).at(0);

        this.main.items.forEach((m: any) => {
          this.permission.checkMenuByPath(this.user, m);
        });
        this.menus = this.main ? this.main.items : [];
        this.default_menu.forEach(
          (m: any) => {
            this.permission.checkMenuByPath(this.user, m);
            let exist = this.menus.filter(
              (i: any) => {
                if (i.id == m.id) {
                  return true;
                } else {
                  return false;
                }
              }
            );
            // Si no exists
            if (exist.length == 0) {
              this.menus.push(m);
            }
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.watcher.unsubribe();
  }

  onClipse() {
    let slide_content = document.getElementById('col-content-left');
    let menu = document.getElementById('navbarDefault');
    let chevron_left = document.getElementById('chevrondoubleleft');
    let chevron_right = document.getElementById('chevrondoubleright');
    if (slide_content && menu) {
      if (chevron_left) {
        chevron_left.style.display = 'none';
      }
      if(chevron_right) {
        chevron_right.style.display = 'block';
      }
      slide_content.style.width = "55px";
      menu.style.left = "4px";
    }
  }
}
