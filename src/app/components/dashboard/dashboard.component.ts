import {Component, Input, ChangeDetectorRef, AfterContentChecked, OnDestroy, OnInit} from '@angular/core';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() dashboard = {
    sm: 'ml-sm-auto',
    md: 'col-md-12',
    lg: 'col-lg-12'
  };

  main: any;
  show_dashbord: boolean = false;
  watcher: any;

  constructor(private subjetc: SubjectService, private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.watcher = this.subjetc.observable.subscribe(
      (shutters: string[]) => {
        let shutter = shutters.at(0);
        this.show_dashbord = shutter == 'default';
      }
    );
    this.subjetc.emitShutter('default');
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }
}
