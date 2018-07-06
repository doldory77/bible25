import { Component, ViewChild } from '@angular/core';
import { 
  IonicPage, 
  LoadingController, 
  NavController, 
  Platform, 
  MenuController, 
  Loading,
  AlertController,
  ActionSheetController,
  Content
} from 'ionic-angular';

import { Observable, Subscription } from 'rxjs/Rx'
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { NativeAudio } from '@ionic-native/native-audio';
import { MenuProvider } from '../../providers/menu/menu';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private platform: Platform,
    private menuCtrl: MenuController,
    public indicator: LoadingController,
    public alertCtrl: AlertController,
    public sheetCtrl: ActionSheetController,
    private globalVars: GlobalVarsProvider,
    private nativeAudio: NativeAudio,
    public menuProvider: MenuProvider,) {

  }

  @ViewChild(Content) content: Content;

  iframe: any;
  unRegisterBackButton: Function;
  topBackIconIsNotActive: boolean = true;
  topBackIconStateSubscription: Subscription;
  topSearchBtnFlag: boolean = false;
  loading: Loading = null;
  searchKeyWord: string = '';
  // url: string = "http://ch2ho.bible25.com/m/main_renewal_android.php";
  // url: string = "http://ch2ho.bible25.com/m/main_all.php";
  url: string = this.menuProvider.MenuData.get('home').url;

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
  }

  /*
  시작시 메인홈 감시 시작(페이지 오픈시 매번 호출)
  */
  ionViewWillEnter() {
    this.topBackIconStateSubscription = Observable.interval(1000).subscribe(_ => {
      this.topBackIconIsNotActive = this.isBibleMainUrl();
    });
    this.globalVars.getValueWithStorage('test')
    // this.iframe.location.reload(true);
    this.iframe.postMessage('reload', '*');
  }

  /*
  페이지 종료시 메인홈 감시 종료
  */
  ionViewWillLeave() {
    try {
      this.topBackIconStateSubscription.unsubscribe();
    } catch(e) { console.error('error: ', e) }
  }

  isBibleMainUrl() {
    // return (/main_renewal_[a-z,1-9,A-Z]+.php/g).test(this.iframe.location.href);
    return (/main_all.php/g).test(this.iframe.location.href);
  }

  toggleMenu() {
    this.nativeAudio.play('click', () => {});
    this.menuCtrl.toggle();
  }

  onBack() {
    this.nativeAudio.play('click', () => {});
    this.iframe.history.back();
  }

  iframeLoaded() {
    if (this.loading) {
      try { this.loading.dismiss(); } catch (err) {}
    }
    try {
      let frm: any = document.getElementById('iframe');
      let frmDoc: any = frm.contentDocument || frm.contentWindow;
      frmDoc.getElementById('fixedBox').style.display = 'none';
      let tables: any = frmDoc.getElementsByTagName('table');
      tables[tables.length - 5].style.display = 'none';
      this.screenUpdate();
    } catch (err) {
      // console.error('fixedBox display hide error: ', err); 고의적으로 표시 안함
    }
  }

  goUrl(url: string) {
    if (url) {
      if (url == this.iframe.location.href) {
        return;
      }
      this.loading = this.indicator.create({
        showBackdrop: false,
        // content: `<div>Loading...</div>`, 
        cssClass: 'only-loading-icon',
        spinner: 'circles', 
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.iframe.location.href = url;

    }
  }

  /**
   * 종합검색 페이지로 이동
   */
  goSearchPage() {
    if (this.searchKeyWord != "") {
      let url = this.menuProvider.MenuData.get('search').url;
      this.goUrl(url + this.searchKeyWord);
      this.searchKeyWord = "";
      this.toggleSearchBar();
    }
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
          handler: () => {}
        },
        {
          text: 'Archive',
          handler: () => {}
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    }).present();
  }

  configPage() {
    this.nativeAudio.play('click', () => {});
    this.navCtrl.push('ConfigPage');
  }

  myPage() {
    this.nativeAudio.play('click', () => {});
    this.navCtrl.push('MyPage');
  }

  toggleSearchBar() {
    this.nativeAudio.play('click', () => {});
    this.topSearchBtnFlag = !this.topSearchBtnFlag;
    this.screenUpdate();
  }
  
  screenUpdate(){
    this.content.resize();
  }

}
