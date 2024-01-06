import {Message} from "./message";

export class Error extends Message {
  /**
   * Constructeur de l'objet erreur.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'error', duration: number = 1000) {
    super(message, type, duration);
    this.code = 500;
  }
}
