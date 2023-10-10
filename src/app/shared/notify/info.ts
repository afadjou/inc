import {Message} from "./message";

export class Info extends Message {
  /**
   * Constructeur de l'objet Info.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'info') {
    super(message, type);
    this.code = 0;
  }
}
