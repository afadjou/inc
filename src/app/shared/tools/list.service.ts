import { Injectable } from '@angular/core';
import {RestService} from "./rest.service";
import {NotifyService} from "../notify/services/notify.service";
import {Error} from "../notify/error";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor() { }

  /**
   * Retourne une liste des roles.
   */
  rols() {
    return [
      { id: 'administrator', label: 'Administrateur' },
      { id: 'etudiant', label: 'Etudiant' },
      { id: 'enseignant', label: 'Professeur' }
    ];
  }

  serials() {
    return [
      { id: 'S', label: 'Scientifique'},
      { id: 'A', label: 'Litéraire' },
      { id: 'G', label: 'Génerale' }
    ];
  }

  /**
   * Retournes la liste des epreuves aux examens
   */
  matters() {
    return [
      { id: 'fr', label: 'Français' },
      { id: 'philo', label: 'Philosophie' },
      { id: 'lv', label: 'Langue vivante' },
      { id: 'hist_g', label: 'Histoire-Géographie'},
      { id: 'math', label: 'Mathématiques' },
      { id: 'scp', label: 'Sciences-Physiques'},
      { id: 'scn', label: 'Sciences-Naturelles'},
      { id: 'esp', label: 'Education Sportive et phyisique' },
      { id: 'dessin', label: 'Dessin au choix'}
    ];
  }

}
