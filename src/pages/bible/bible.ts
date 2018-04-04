import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { SQLiteObject } from '@ionic-native/sqlite';
import { MenuType } from '../../model/model-type'
import { MenuProvider } from '../../providers/menu/menu'
import { Content } from 'ionic-angular';

/**
 * Generated class for the BiblePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bible',
  templateUrl: 'bible.html',
})
export class BiblePage {

  @ViewChild(Content) content: Content;

  isBibleMode: boolean = true;
  menuData: MenuType[] = [];
  data: any[] = [];
  iframe: any;
  loading: Loading;
  bibleContents: {lang:string, book:number, jul:number, content:string, ord:number}[] = [];

  currBookName: string = '';
  currJangNumber: number = 0;
  currSelectedLanguage: string = '';
  isChange: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private menu: MenuProvider,
    private db: DbProvider,
    private indicator: LoadingController) {

      Array.from(this.menu.MenuData.keys())
        .filter(key => key.startsWith('bible_menu'))
        .forEach(key => {
          console.log(key);
          this.menuData.push(this.menu.MenuData.get(key));
        });

        // console.log(this.menuData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiblePage');
    this.iframe = document.getElementById('iframe2')['contentWindow'];
    this.menuData[0].selected = true;

    setTimeout(() => {
      // this.navCtrl.push('BibleListPage');
      console.log('TODO: 사용자가 최종 본 성경이 없으면 리스트 페이지 표시 후 되돌아오기')
    }, 2000);
    
  }

  ionViewWillEnter() {

    // this.getBibleWrap()

  }

  getBibleWrap() {

    this.db.getAppInfo()
    .then(result => {
      // console.log(result);
      // console.log(this.db.appInfo);
      let params = {
        book: this.db.appInfo.view_bible_book,
        jang: this.db.appInfo.view_bible_jang,
        multiLang: this.db.appInfo.selected_eng_names.split(',')
      }

      if (this.currBookName == this.db.appInfo.book_name 
          && this.currJangNumber == this.db.appInfo.view_bible_jang
          && this.currSelectedLanguage == this.db.appInfo.selected_first_name) {
        this.isChange = false;
      } else {
        this.currBookName = this.db.appInfo.book_name;
        this.currJangNumber = this.db.appInfo.view_bible_jang;
        this.currSelectedLanguage = this.db.appInfo.selected_first_name;
        this.isChange = true;
      }

      if (this.isChange) {
        this.db.getBibleContent(this.bibleContents, params)
          .then(result => {
            // console.log(result);
            // console.log("===================================>");
            // console.log(this.bibleContents);
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));

  }
  
  onSubPage(menuNum: number) {
    this.menuData.forEach(menu => menu.selected = false);
    const menu = this.menuData[menuNum];
    menu.selected = true;

    if (menuNum > 0) {
      this.isBibleMode = false;
      this.loading = this.indicator.create({
        showBackdrop: false,
        content: `<div>Loading...</div>`, 
        spinner: 'circles', 
        dismissOnPageChange: true, 
      });
      this.loading.present();
      this.iframe.location.href = menu.url;
    } else {
      this.isBibleMode = true;
      setTimeout(() => {
        this.update();
      }, 10);
    }
  }

  iframeLoaded() {
    if (this.loading) {
      this.update();
      this.loading.dismiss();
    }
  }

  pressed() {
    console.log('pressed');
  }

  active() {
    console.log('active');
  }

  released() {
    console.log('released');
  }

  update(){
    this.content.resize();
  }
}
