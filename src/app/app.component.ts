import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';

import { MenuType } from '../model/model-type';
import { MenuProvider } from '../providers/menu/menu';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  /* accordian menu */
  todayMenuIsOpen = false;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuProvider: MenuProvider,
    public indicator: LoadingController) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.menuData = this.menuProvider.MenuData;
    // console.log(this.menuData);
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
      // console.log('==> ', home.iframe)
      // document.getElementById('iframe')['contentWindow'].location.href = url;
      home.goUrl(url);
      // home.url = url;
    }
  }

}
