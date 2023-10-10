import { Component } from '@angular/core';
import {LogoService} from "../../shared/logo/services/logo.service";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {

  constructor(public logoService: LogoService) {
  }
}
