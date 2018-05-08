import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController, AlertController } from 'ionic-angular';

import { MenuType } from '../model/model-type';
import { MenuProvider } from '../providers/menu/menu';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NativeAudio } from '@ionic-native/native-audio';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  networkConnectionSubscription: Subscription;
  netWorkDisConnectionSuscription: Subscription;

  /* accordian menu */
  todayMenuIsOpen = false;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuProvider: MenuProvider,
    public indicator: LoadingController,
    private alertCtrl: AlertController,
    private nativeAudio: NativeAudio,
    private push: Push,
    private network: Network,
    private globalVars: GlobalVarsProvider) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
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
    // this.nativeAudio.preloadSimple('click', 'assets/audio/click_on.mp3')
    //     .then(() => {console.info('sound loaded')}, error => {console.error(error)});
    // this.checkPushPermission();
    // this.networkCheck();
  }

  ngOnDestroy() {
    console.info("App Destroy");
    this.networkUnsubscription();
  }

  menuData: Map<string, MenuType>;

  openPage(menu: string) {
    
    let targetMenu: MenuType = this.menuData.get(menu);
    this.menuHighlight(menu);
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
