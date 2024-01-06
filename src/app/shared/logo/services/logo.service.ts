import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  constructor() { }

  /**
   * Retourne le path d'accès à l'image.
   *
   * @param color
   * @param type
   * @param ext
   */
  public src(color: string = 'green', type: string = '', ext: string = 'png') {
    type = type ? '_' + type : '';
    let fileName = this.path() + '/logo_inc_' + color + type + '.' + ext;
    if (this.exists(fileName)) {
      return fileName;
    } else {
      return this.path() + '/logo_inc_green.png';
    }
  }

  /**
   * Formate le text en contenu HTML sous de forme de String.
   *
   * @param text
   */
  public formatText(text: string) {
    let t = text.split(' ');
    text = '<h3>I - <span>Numérique</span></h3><h4>' + t[0];
    if (t[1]) {
      text += '<span> ' + t[1] + '</span>';
    }
    text += '</h4>';

    if (t[2]) {
      text += '<p>' + t[2] + '</p>';
    }

    return text;
  }
  /**
   * Retourne le répertoire contenant les logos.
   */
  public path() {
    return '/assets/images/logos';
  }

  /**
   * Vérifie si l'image existe.
   *
   * @param fileName
   */
  public exists(fileName: string) {
    let file = new Image();
    file.src = fileName;

    return file.height != 0;
  }
}
