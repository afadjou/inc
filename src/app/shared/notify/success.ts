import {Message} from "./message";

export class Success extends Message {
  /**
   * Constructeur de l'objet warning.
   *
   * @param message
   * @param type
   */
  constructor(message: string, type: string = 'success', duration: number = 1000) {
    super(message, type, duration);
    this.code = 0;
  }
}
