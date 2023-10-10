import {Message} from "./message";

export class Warning extends Message {
  /**
   * Constructeur de l'objet warning.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'warning') {
    super(message, type);
    this.code = 0;
  }
}
