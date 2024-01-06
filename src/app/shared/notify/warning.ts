import {Message} from "./message";

export class Warning extends Message {
  /**
   * Constructeur de l'objet warning.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'warning', duration: number = 1000) {
    super(message, type, duration);
    this.code = 0;
  }
}
