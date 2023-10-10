import {Message} from "./message";

export class Error extends Message {
  /**
   * Constructeur de l'objet erreur.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'error') {
    super(message, type);
    this.code = 500;
  }
}
