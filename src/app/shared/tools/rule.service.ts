import { Injectable } from '@angular/core';
import {ListService} from "./list.service";

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  listService: ListService = new ListService();
  constructor() { }

  /**
   * Date de délibération de l'examen : A lire dans une conf
   */
  dateEdition(rn: any) {
    const dte = new Date();
    return rn.deliberation_date ? new Date(rn.deliberation_date).toLocaleDateString() : dte.toLocaleDateString();
  }

  /**
   * Decision du jury
   * @param moyenne
   */
  decision (moyenne: number) {
    if (moyenne < 8)  { return 'REFUSE'; }
    if (moyenne < 10) { return 'ACCEPTE' };
    if (moyenne >= 10) { return 'ADMIS' };

    return '';
  }
  mention (moyenne: number) {
    if (moyenne < 8)  { return 'REFUSE'; }
    if (moyenne < 10) { return 'PASSABLE' };
    if (moyenne < 12) { return 'ASSEZ-BIEN' };
    if (moyenne < 14) { return 'BIEN' };
    if (moyenne < 17) { return 'TRES-BIEN' };
    if (moyenne < 19) { return 'EXCELLENT' };
    if (moyenne >= 19) { return 'HONORABLE' };
    return '';
  }
  moy(data: any): any {
    if (Array.isArray(data?.notes)) {
      let rows: any[] = [];
      let total_coef: number = 0;
      let total_notes: number = 0;
      data.notes.forEach(
        (row: any) => {
          const m = data.matters.filter(
            (i: any) => {
              return i.serial == data.rn?.serial && i.label == row.matter;
            }
          ).at(0);
          let matter = this.listService.matters().filter(
            (i: any) => {
              return i.id == row.matter;
            }
          ).at(0);
          if (m && matter) {
            total_coef += Number(m.coef);
            total_notes += Number(row.note) * Number(m.coef);
          }
        }
      );

      // Moyenne
      const moy = Math.fround(total_notes / total_coef);

      return {
        moy: moy,
        decision: this.decision(moy),
        mention: this.mention(moy)
      };
    }

    return null;
  }
}
