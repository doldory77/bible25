import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';

/**
 * Generated class for the AdPopupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ad-popup',
  templateUrl: 'ad-popup.html'
})
export class AdPopupComponent {

  text: string;

  constructor(private viewCtrl: ViewController,
    private platform: Platform) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  appClose() {
    this.platform.exitApp();
  }



}
