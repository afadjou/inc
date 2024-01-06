import {Message} from "./message";

export class Info extends Message {
  /**
   * Constructeur de l'objet Info.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'info', duration: number = 1000) {
    super(message, type, duration);
    this.code = 0;
  }
}
