import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../services/auth.service";
import { User } from '../services/user';
import { NgForm } from '@angular/forms';
import { FileService } from 'src/app/shared/file/services/file.service';
import { NotifyService } from 'src/app/shared/notify/services/notify.service';
import { Error } from 'src/app/shared/notify/error';
import { ActivatedRoute } from '@angular/router';
import { UserQuery } from 'src/app/shared/query/user.query';
import { Subject } from 'rxjs';
import { SubjectService } from 'src/app/shared/subscriber/subject.service';
import {ListService} from "../../../shared/tools/list.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [
    './sign-up.component.scss',
    '../sign-in/sign-in.component.scss'
  ]
})
export class SignUpComponent implements OnInit {
  @ViewChild('form') form : NgForm | undefined;
  user: any = {
    uid: '',
    email: '',
    name: '',
    firstName: '',
    phoneNumber: '',
    photoURL: '',
    emailVerified: false,
    lastSignInTime: '',
    birthday: new Date(),
    role: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cne: '',
  };
  is_new: boolean = true;
  buttonOptions: any = {
    text: 'Soumettre',
    type: 'success',
    useSubmitBehavior: true
  };
  picture: any = undefined;
  serials: any[] = [];
  roles: any[] = [];
  connectedUser: any;
  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private uq: UserQuery,
    private subject: SubjectService,
    public listService: ListService
  ) { }

  ngOnInit(): void {
    const uid = this.route.snapshot.params['uid'];
    if (uid) {
      this.uq.getUserByUID(uid).valueChanges().subscribe(
        (user: any) => {
          let dte = user.birthday && user.birthday.seconds ? new Date(user.birthday.seconds * 1000) : new Date();
          user.birthday = dte;
          this.user = user;
          this.is_new = false;
        }
      );
    }

    this.serials = this.listService.serials();
    this.roles = this.listService.rols();

    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter(shutter);
    this.connectedUser = JSON.parse(localStorage.getItem('user')!);

  }

  onFormSubmit(e: any) {

    // On veririfie si l'adresse email n'est pas utilisé.
    if (!this.user.uid) {
      this.authService.mailExists(this.user.email).then(
        (re) => {
          if (re) {
            this.notifyService.notify(new Error("L'adresse email renseignée est déjà utilisée"));
            return;
          }

          // DO SAVE
          if (this.picture) {
            this.fileService.uploadFile(this.picture).then(
              (url: any) => {
                this.user.photoURL = url;
                this.authService.createUser(this.user);
              }
            );
          } else {
            this.authService.createUser(this.user);
          }
        },
      );
    } else {
      if (this.picture) {
        this.fileService.uploadFile(this.picture).then(
          (url: any) => {
            this.user.photoURL = url;
            this.authService.updateUser(this.user);
          }
        );
      }else {
        this.authService.updateUser(this.user);
      }

    }
  }

  onUploaded(e: any) {
    this.fileService.uploadFile(e.target.files[0], '', 'tmp').then(
      (url: any) => {
        this.user.photoURL = url;
        this.picture = e.target.files[0];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
