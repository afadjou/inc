import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

export class TabsComponent implements OnInit {
@Input() all_active_class: string = 'active';
@Input() admin_active_class: string = '';
@Input() others_active_class: string = '';
  ngOnInit(): void {

  }
}
