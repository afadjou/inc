export class Message {
  message: string = '';
  code: number = 200;
  width: number = 400;
  height: number = 100;
  position: any = {
    my: 'center center',
    at: 'center center'
  }
  public _duration: number = 1000;
  public _type: string;

  /**
   * Constructeur.
   * Assignation du message.
   *
   * @param message
   */
  constructor(message: string, type: string = 'info') {
    this.message = message;
    this._type = type;
  }

}
