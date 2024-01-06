import DevExpress from "devextreme";
import {base64_encode} from "devextreme/data/utils";
import {FileService} from "../file/services/file.service";
import {ListService} from "../tools/list.service";
import {RuleService} from "../tools/rule.service";

export class Editique {
  request: any;
  errors: any[] = [];
  data: any;

  listService: ListService = new ListService();
  ruleService: RuleService = new RuleService();

  constructor(doc_key: string, output_format: string, data: any) {
    this.data = data;
    this.request = {
      call: {
        action: 'editique',
        download: false,
        models: [
          {
            docKey: doc_key,
            format: output_format,
            convertor: 'soffice',
            contentFile: data?.content,
            settings: {
              data: []
            }
          }
        ]
      }
    }
  }

  /**
   * Prepare le flux à soumettre
   * @param user
   * @param afs
   */
  prepare(user: any) {
    // Ajout Name/FirstName
    this.add({ id: 'name', type: 'text', value: user.identite.nomUsage });
    this.add({ id: 'first_name', type: 'text', value: user.identite.prenom });
  }
  /**
   * Ajout un champ dans le flux de données.
   * @param field
   * @param model_key
   */
  add(field: any, model_key: number = 0) {
    this.request.call.models[model_key].settings.data.push(field);
  }
}
