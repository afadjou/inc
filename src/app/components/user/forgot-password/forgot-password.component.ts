import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../sign-in/sign-in.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthService) {
  }
  ngOnInit() {}
}
