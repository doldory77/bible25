import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub',
  templateUrl: 'sub.html',
})
export class SubPage {

  iframe: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubPage');
    this.iframe = document.getElementById('iframe2')['contentWindow'];
    this.iframe.location.href = this.navParams.get('url');
  }

}
