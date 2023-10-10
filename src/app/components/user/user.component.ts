import {Component, Injectable, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import {AuthGuardService} from './services/auth-guard-service.service';
import {AuthService} from "./services/auth.service";
import { SubjectService } from 'src/app/shared/subscriber/subject.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: any;
  notify: any;
  errorMessage: string | undefined;
  roles: any = {};

  buttonOptions: any = {
    text: 'Enregistrer',
    type: 'success',
    useSubmitBehavior: true,
  };
  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private authGaurd: AuthGuardService,
              private subject: SubjectService) {
  }

  ngOnInit(): void {
    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter('global');
  }
}
