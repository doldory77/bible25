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

        console.log(this.menuData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiblePage');
    this.iframe = document.getElementById('iframe2')['contentWindow'];

    setTimeout(() => {
      this.navCtrl.push('BibleListPage');
    }, 2000);
    // this.getSelectedBibleTable();
  }

  getSelectedBibleTable() {
    this.db.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql("select eng_name from bible_db_name order by seq", {});
      })
      .then(data => {
        console.log(data.rows.length)
      })
      .catch(err => {
        console.log('database open error: ', err);
      });
  }

  onSubPage(menuNum: number) {
    const menu = this.menuData[menuNum];
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
