import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, MenuController, NavParams } from 'ionic-angular';

import { Observable, pipe, Subscription } from 'rxjs/Rx'
import { map, delay } from 'rxjs/operators'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private platform: Platform,
    private menuCtrl: MenuController,
    private navParams: NavParams) {

  }

  iframe: any;
  unRegisterBackButton: any;
  topBackIconIsActive: boolean = true;
  topBackIconStateSubscription: Subscription;
  topSearchBtnFlag = false;

  /*
  Android Back Button 오버라이드
  */
  customBackButton(): any {
    return this.platform.registerBackButtonAction(() => {
      this.iframe.history.back();
    });
  }

  ionViewDidLoad() {
    this.iframe = document.getElementById('iframe')['contentWindow'];
    
    this.unRegisterBackButton = this.customBackButton();
    this.platform.registerBackButtonAction(() => {
      this.iframe.history.history.back();
    });
  }

  /*
  시작시 메인홈 감시 시작(페이지 오픈시 매번 호출)
  */
  ionViewWillEnter() {
    this.topBackIconStateSubscription = Observable.interval(1000).subscribe(_ => {
      this.topBackIconIsActive = this.isBibleMainUrl();
    });
  }

  /*
  페이지 종료시 메인홈 감시 종료
  */
  ionViewWillLeave() {
    try {
      this.topBackIconStateSubscription.unsubscribe();
    } catch(e) { console.log('error: ', e) }
  }

  isBibleMainUrl() {
    return (/main_renewal_[a-z,1-9,A-Z]+.php/g).test(this.iframe.location.href);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  onBack() {
    this.iframe.history.back();
  }

}
