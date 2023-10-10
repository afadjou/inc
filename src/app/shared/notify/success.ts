import {Message} from "./message";

export class Success extends Message {
  /**
   * Constructeur de l'objet warning.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'success') {
    super(message, type);
    this.code = 0;
  }
}
