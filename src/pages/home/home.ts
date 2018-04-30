import { Component, ViewChild } from '@angular/core';
import { 
  IonicPage, 
  LoadingController, 
  NavController, 
  Platform, 
  MenuController, 
  NavParams, 
  ViewController, 
  Loading,
  AlertController,
  ActionSheetController,
  Content 
} from 'ionic-angular';

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
    private navParams: NavParams,
    private viewCtrl: ViewController,
    public indicator: LoadingController,
    public alertCtrl: AlertController,
    public sheetCtrl: ActionSheetController) {

  }

  @ViewChild(Content) content: Content;

  iframe: any;
  unRegisterBackButton: Function;
  topBackIconIsNotActive: boolean = true;
  topBackIconStateSubscription: Subscription;
  topSearchBtnFlag: boolean = false;
  loading: Loading = null;
  searchKeyWord: string = '';
  url: string = "http://ch2ho.bible25.com/m/main_renewal_android.php";

  /*
  Android Back Button 오버라이드
  */
  customBackButton(): Function {
    return this.platform.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
        return;
      } else {
        if (this.topBackIconIsNotActive) {
          this.unRegisterBackButton();
        } else {
          this.iframe.history.back();
        }
      }
    });
  }

  ionViewDidLoad() {
    this.iframe = document.getElementById('iframe')['contentWindow'];
    this.unRegisterBackButton = this.customBackButton();
    // this.platform.registerBackButtonAction(() => {
    //   this.iframe.history.history.back();
    // });
  }

  /*
  시작시 메인홈 감시 시작(페이지 오픈시 매번 호출)
  */
  ionViewWillEnter() {
    // console.log('==> ', this.navCtrl.getActive().name);
    this.topBackIconStateSubscription = Observable.interval(1000).subscribe(_ => {
      this.topBackIconIsNotActive = this.isBibleMainUrl();
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

  public goPage(url: string) {
    this.iframe.location.href = url;
  }

  iframeLoaded() {
    if (this.loading) {
      this.loading.dismiss();
    }
    try {
      let frm: any = document.getElementById('iframe');
      let frmDoc: any = frm.contentDocument || frm.contentWindow;
      frmDoc.getElementById('fixedBox').style.display = 'none';
      let tables: any = frmDoc.getElementsByTagName('table');
      tables[tables.length - 5].style.display = 'none';
      this.screenUpdate();
    } catch (err) {
      console.log('fixedBox display hide error: ', err);
    }
  }

  goUrl(url: string) {
    if (url) {
      this.loading = this.indicator.create({
        showBackdrop: false,
        content: `<div>Loading...</div>`, 
        spinner: 'circles', 
        dismissOnPageChange: true, 
      });
      this.loading.present();
      this.url = url;
      // this.iframe.location.href = url;
    }
  }

  /**
   * 종합검색 페이지로 이동
   */
  goSearchPage() {
    // this.searchKeyWord = '';
    // this.topSearchBtnFlag = false;
    // this.navCtrl.push('SearchPage', {keyword:this.searchKeyWord});
    this.url = "http://ministrynote.com/bbs/search_bible25.php?sfl=wr_subject&sop=and&stx=" + this.searchKeyWord;
  }

  showAlert() {
    this.alertCtrl.create({
      title: 'abcd',
      subTitle: 'defg',
      buttons: ['Dismiss']
    }).present();
  }

  showSheet() {
    this.sheetCtrl.create({
      title: 'hello',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).present();
  }

  toggleSearchBar() {
    this.topSearchBtnFlag = !this.topSearchBtnFlag;
    this.screenUpdate();
  }
  
  screenUpdate(){
    this.content.resize();
  }

}
