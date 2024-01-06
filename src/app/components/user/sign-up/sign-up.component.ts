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
import {Warning} from "../../../shared/notify/warning";
import {Success} from "../../../shared/notify/success";

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
    name: '',
    mail: '',
    created: '',
    changed: '',
    roles: [],
    image: {},
    identite: {},
    adresses: {},
    contact: {}
  };
  is_new: boolean = true;
  buttonOptions: any = {
    text: 'Soumettre',
    type: 'success',
    useSubmitBehavior: true
  };
  picture: any = undefined;
  serials: any[] = [];
  roles_list: any[] = [];
  selectedRoles: string[] = [];
  roles: any[] = [];
  connectedUser: any;
  isAdministrator: boolean = false;
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
    // Utilisateur connecté.
    this.connectedUser = JSON.parse(localStorage.getItem('user')!);

    // Si l'tulisateur connecté est ADMIN.
    const admin = this.connectedUser.roles.filter((role: any) => {
      return role.id == 'administrator';
    });
    this.isAdministrator = admin.length > 0;

    // Récupération du détail de l'utilisateur à afficher.
    const uid = this.route.snapshot.params['uid'];
    if (uid) {
      this.authService.getUser(uid).then(
        (result: any) => {
          if (result.user) {
            this.user = result.user;
            // Recherche adresse active
            this.user.adresses = this.user.adresses.find(
              (ad: any) => {
                return ad.active == 1;
              }
            );
            // Recherche contact active
            this.user.contact = this.user.contact.find(
              (ct: any) => {
                return ct.actif == 1;
              }
            );

            // Roles
            this.user.roles.forEach((role: any) => {
              this.selectedRoles.push(role.id);
            });
            this.is_new = false;
          } else {
            this.notifyService.notify(new Warning(result.message, 'warning', 3000));
          }
        },
        (error: any) => {
          this.notifyService.notify(new Error(error.error.message, 'error', 3000));
        }
      );
    }

    this.roles_list = this.listService.rols();

    const shutter: string = localStorage.getItem('shutter_id') ?? '';
    this.subject.emitShutter(shutter);
  }

  onSelectionRoleChanged(e: any) {

  }
  onFormSubmit(e: any) {
    // On veririfie si l'adresse email n'est pas utilisé.
    if (this.user.uid) {
      this.authService.updateUser(this.user).then((result: any) => {
        if(result && result.code === 200) {
          this.notifyService.notify(new Success('La fiche utilisateurs à été mise à jour avec succès.', 'success', 3000));
        } else {
          this.notifyService.notify(new Error('La mise à jour de la fiche utilisateur a echoué.', 'error', 3000))
        }
      });
    }
  }

  onUploaded(e: any) {
    let file: File = e.target.files[0];
    if (file) {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.user.image.content = reader.result;
        }
      });
    }
  }

}
