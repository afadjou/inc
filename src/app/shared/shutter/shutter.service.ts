import { Injectable } from "@angular/core";
import {PermissionService} from "../tools/permission.service";

@Injectable({
  providedIn: 'root'
})
export class ShutterService {
  private shutters: any[] = [
    {
      id: 'default',
      label: 'Accueil',
      icone: '/assets/images/header/home.svg',
      class: 'home-logo',
      enabled: true,
      items: [
        {
          id: 'users',
          label: 'Utilisateurs',
          icone: '/assets/images/header/users.svg',
          class: 'image users-picture',
          url: ['users', 'list'],
          enabled: true,
        }
      ]
    },
    {
      id: 'examens',
      label: "Gestion d'examens",
      icone: '/assets/images/panel/examen.svg',
      class: 'home-logo',
      url: '#',
      enabled: true,
      items: [
        {
          id: 'teachers',
          label: 'Professeurs',
          icone: '/assets/images/header/prof.svg',
          class: 'image prof-picture',
          url: ['shutters', 'teachers', 'list'],
          enabled: true,
        },
        {
          id: 'students',
          label: 'Etudiants',
          icone: '/assets/images/header/etudiant.svg',
          class: 'image student-picture',
          url: ['shutters', 'students', 'list'],
          enabled: true,
        },
        {
          id: 'matters',
          label: 'Modules',
          icone: '/assets/images/header/module.svg',
          class: 'image matter-picture',
          url: ['shutters', 'matters', 'list'],
          enabled: true,
        }
      ]
    },
    {
      id: 'educations',
      label: 'Educations',
      icone: '/assets/images/panel/education.svg',
      url: '#',
      enabled: false,
      items: []
    },
    {
      id: 'sports',
      label: 'Sports',
      icone: '/assets/images/panel/sport.svg',
      url: '#',
      enabled: false,
     items: []
    },{
      id: 'santé',
      label: 'Santé',
      icone: '/assets/images/panel/sante.svg',
      url: '#',
      enabled: false,
      items: []
    },
    {
      id: 'concours',
      label: 'Concours',
      icone: 'assets/images/panel/concours.svg',
      url: '#',
      enabled: false,
      items: []
    },
    {
      id: 'statistiques',
      label: 'Statistiques',
      icone: 'assets/images/panel/states.svg',
      url: '#',
      enabled: false,
      items: []
    }
  ];

  getShutters() {
    return this.shutters.filter(
      (shutter: any) => {
        if (shutter.enabled) {
          return true;
        } else {
          return false;
        }
      }
    );
  }
  getShuttersWidhExcludes(excludes: string[] = []) {
    return this.shutters.filter(
      (shutter: any) => {
        if (!excludes.includes(shutter.id)) {
          return true;
        } else {
          return false;
        }
      }
    );
  }
}
