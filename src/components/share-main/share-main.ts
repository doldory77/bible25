import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { Observable, Subscription } from 'rxjs/Rx'
import { EXTRA_MSG } from '../../model/model-type';

@Component({
  selector: 'share-main',
  template:`
    <div class="box">
      <div class="btn" (click)="support()">
        <ion-icon name="share" style="color:#000; font-size: 40px;"></ion-icon>
      </div>
      <div class="btn" (click)="recommendation()">
        <ion-icon name="share" style="color:#000; font-size: 40px;"></ion-icon>
      </div>
    </div>
  `
})
export class ShareMainComponent {

  constructor(public viewCtrl: ViewController, 
    public navParams: NavParams,
    private platform: Platform,
    private browser: InAppBrowser) {

  }

  inAppBrowserPptions: InAppBrowserOptions = {
    location: 'no',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'close',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    // toolbarposition: 'top',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    presentationstyle: 'formsheet',
    fullscreen: 'yes'
  }

  inAppBrowserObj: InAppBrowserObject;
  inAppSubscription: Subscription;

  close() {
    this.viewCtrl.dismiss();
  }

  support() {
    // console.log('후원하기');
    this.inAppBrowserObj = this.browser.create('https://www.ihappynanum.com/Nanum/B/L7Y849VB0V', '_blank', this.inAppBrowserPptions);
      this.inAppSubscription = this.inAppBrowserObj.on('exit').subscribe(data => {
        if (this.inAppBrowserObj) try { this.inAppBrowserObj.close(); this.inAppSubscription.unsubscribe(); this.inAppBrowserObj = undefined; } catch (err) { console.error(err); }  
      }, err => {console.error(err)});
    this.close();
  }

  recommendation() {
    // console.log('추천하기');
    var param = {
      title: '',
      subject: '',
      text: EXTRA_MSG.RECOMMENDATIION_INFO
    };
    if (this.platform.is('ios')) {
      window['cordova'].plugins.customPlugin.func('customPlugin', 'share', [EXTRA_MSG.RECOMMENDATIION_INFO], null, (err) => {alert(err)});
    } else {
      window['cordova'].plugins.customPlugin.func('customPlugin', 'share', [param], (res) => {}, (err) => {alert(err)});
    }
    this.close();
  }



}
