import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MenuType } from '../model/model-type';
import { MenuProvider } from '../providers/menu/menu';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NativeAudio } from '@ionic-native/native-audio';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { Network } from '@ionic-native/network';
// import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs/Observable';
import { Observable, Subscription } from 'rxjs/Rx'
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'app.html',
  providers: [
    ScreenOrientation
  ]
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  networkConnectionSubscription: Subscription;
  netWorkDisConnectionSuscription: Subscription;
  iframeCallCheckSubscription: Subscription;

  /* accordian menu */
  todayMenuIsOpen = false;

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

  inAppBrowserObj: InAppBrowserObject
  inAppSubscription: Subscription;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuProvider: MenuProvider,
    public indicator: LoadingController,
    private alertCtrl: AlertController,
    private nativeAudio: NativeAudio,
    private push: Push,
    private network: Network,
    private screenOrientation: ScreenOrientation,
    private globalVars: GlobalVarsProvider,
    private browser: InAppBrowser) {

    this.initializeApp();
    this.iframeEventObserve();
    this.showAd();
    
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }

  iframeEventObserve() {
    window['iframe_call'] = {apiNum:0};
    window.addEventListener('message', function(e){
      switch(e.data.page) {
        case 'bible':
          window['iframe_call'].apiNum = 1;
          break;
        case 'hymn':
          window['iframe_call'].apiNum = 2;
          break;
        case 'posmall':
          window['iframe_call'].apiNum = 3;
          break;
        default:
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  showAd() {
    setTimeout(() => {
      this.openPage("showAd");
    }, 500);
  }

  networkCheck() {
    
    this.globalVars.addValue('networkType', this.network.type);
    this.globalVars.addValue('networkState', "online");

    this.networkConnectionSubscription = this.network.onConnect().subscribe(data => {
      this.globalVars.addValue('networkType', this.network.type);
      this.globalVars.addValue('networkState', data.type);
      console.info(this.globalVars.getValue("networkType"), " ===> ", this.globalVars.getValue("networkState"));
    }, error => {console.error(error)});

    this.netWorkDisConnectionSuscription = this.network.onDisconnect().subscribe(data => {
      this.globalVars.addValue('networkType', this.network.type);
      this.globalVars.addValue('networkState', data.type);
      console.info(this.globalVars.getValue("networkType"), " ===> ", this.globalVars.getValue("networkState"));
    }, error => {console.error(error)});
  }

  networkUnsubscription() {
    this.networkConnectionSubscription.unsubscribe();
    this.netWorkDisConnectionSuscription.unsubscribe();
  }

  ngOnInit() {
    this.menuData = this.menuProvider.MenuData;
    this.nativeAudio.preloadSimple('click', 'assets/audio/click_on.mp3')
        .then(() => {console.info('sound loaded')}, error => {console.error(error)});
    this.nativeAudio.preloadSimple('click2', 'assets/audio/click_on2.mp3')
        .then(() => {console.info('sound loaded')}, error => {console.error(error)});
    this.checkPushPermission();
    this.networkCheck();

    this.iframeCallCheckSubscription = Observable.interval(300).subscribe(() => {
      let currentApiNum = window['iframe_call'].apiNum;
      window['iframe_call'].apiNum = 0;
      // console.log(currentApiNum + " ===> " + window['iframe_call'].apiNum);
      switch(currentApiNum) {
        case 1:
          this.openPage('bible');
          break;
        case 2:
          this.openPage('hymn');
          break;
        case 3:
          this.openPage('posmall');
          break;
        default:
      }
    });
  }

  ngOnDestroy() {
    console.info("App Destroy");
    this.networkUnsubscription();
    if (this.iframeCallCheckSubscription) this.iframeCallCheckSubscription.unsubscribe();
  }

  menuData: Map<string, MenuType>;

  openPage(menu: string) {
    this.nativeAudio.play('click', () => {});
    let targetMenu: MenuType = this.menuData.get(menu);
    this.menuHighlight(menu);
    // console.log(targetMenu);
    if (menu === 'posmall' || menu === 'showAd') {
      this.inAppBrowserObj = this.browser.create(targetMenu.url, '_blank', this.inAppBrowserPptions);
      this.inAppSubscription = this.inAppBrowserObj.on('exit').subscribe(data => {
        if (this.inAppBrowserObj) try { this.inAppBrowserObj.close(); this.inAppSubscription.unsubscribe(); this.inAppBrowserObj = undefined; } catch (err) { console.error(err); }  
      }, err => {console.error(err)});
      return;
    }
    // if (menu === 'showAd') {
    //   this.inAppBrowserObj = this.browser.create(targetMenu.url, '_blank', this.inAppBrowserPptions);
    //   this.inAppSubscription = this.inAppBrowserObj.on('exit').subscribe(data => {
    //     if (this.inAppBrowserObj) try { this.inAppBrowserObj.close(); this.inAppSubscription.unsubscribe(); this.inAppBrowserObj = undefined; } catch (err) { console.error(err); }  
    //   }, err => {console.error(err)});
    //   return;
    // }
    if (targetMenu.url) {
      this.nav.popToRoot().then(() => {
        this.goUrl(targetMenu.url);
      });
    } else {
      this.nav.push(targetMenu.page);
    }
  }

  /* 
  선택한 메뉴 하이라이트
  Top 메뉴 선택시 아코디언메뉴 접기
  */
  menuHighlight(target: string) {
    if (this.menuData.get(target).menuLevel === 'top_menu') {
      this.todayMenuIsOpen = false;
    }
    Array.from(this.menuData.keys())
      .forEach(key => {
        if (key !== target) {
          this.menuData.get(key).selected = false;
        }
      });
    this.menuData.get(target).selected = !this.menuData.get(target).selected;  
  }

  goUrl(url: string) {
    if (url) {
      const home: HomePage = <HomePage> this.nav.getByIndex(0).instance
      // console.log(url);
      home.goUrl(url);
    }
  }

  checkPushPermission() {
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.info('We have permission to send push notifications');
          this.initPushNotification();
        } else {
          console.warn('We do not have permission to send push notifications');
        }
      });
  }

  initPushNotification() {
    // console.info("=== Push Notification Init ===");

    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available");
      return;
    }
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };
    
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('error').subscribe(error => console.log('Error with Push Plugin', error));

    pushObject.on('registration').subscribe((data: any) => {
      // console.log('device token -> ', data.registrationId);
      // console.log('registrationType -> ', data.registrationType);
      
      // TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('titleNotification -> ', data.title);
      console.log('additionalData -> ', data.additionalData.customData);

      this.nativeAudio.play('click', () => { console.log('success play audio') });
      
      if (data.additionalData.foreground) {
        console.log('titleNotificationForegroundCheck -> ', data.title);
        console.log('additionalDataForegroundCheck -> ', data.additionalData.customData);

        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [
            {
              text: 'Ignore',
              role: 'cancel'
            },
            {
              text: 'View',
              handler: () => {
                console.log('message', data.message);
              }
            }
          ]
        });
        confirmAlert.present();
      }
    });
  }

}
