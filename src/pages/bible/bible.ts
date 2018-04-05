import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { SQLiteObject } from '@ionic-native/sqlite';
import { MenuType } from '../../model/model-type'
import { MenuProvider } from '../../providers/menu/menu'
import { Content } from 'ionic-angular';
import { PlayerProvider } from '../../providers/player/player';

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

  playerNonVisible = true;
  playState: string = 'play';
  mediaTraker: string = '0:0';
  mediaRange: string = '--:--';
  isMediaRoop: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private menu: MenuProvider,
    private db: DbProvider,
    private indicator: LoadingController,
    private player: PlayerProvider,
    private toast: ToastController) {

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
    console.log('bible will enter=========>');
    console.log(this.db.appInfo);
    this.getBibleWrap()

  }

  test() {
    this.db.getAppInfo();
    console.log(this.db.appInfo);
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
      console.log('===========> isChange: ', this.isChange);
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
        this.screenUpdate();
      }, 10);
    }
  }

  iframeLoaded() {
    if (this.loading) {
      this.screenUpdate();
      this.loading.dismiss();
    }
  }

  screenUpdate(){
    this.content.resize();
  }

  checkOrDown() {
    this.player.checkOrDown({
      book: String(this.db.appInfo.view_bible_book),
      jang: String(this.db.appInfo.view_bible_jang)
    });
  }

  canOnlyPaly(): boolean {
    let currentMediaData = this.player.currentBibleAudioData;

    const flag = this.player.isMediaObjectLive();
    if (flag 
      && currentMediaData.book == String(this.db.appInfo.view_bible_book)
      && currentMediaData.jang == String(this.db.appInfo.view_bible_jang))
    {
      return true;
    } else {
      return false;
    }
  }

  togglePlayer() {
    this.playerNonVisible = !this.playerNonVisible;
    this.screenUpdate();
  }

  playOrPause() {
    
    if (this.playState == 'pause') {
      this.player.pause();
      this.playState = 'play';
      console.log('=================> now pause');
      return;
    }

    console.log('=================> now play');
    if (this.canOnlyPaly()) {
      this.player.play();
      this.playState = 'pause';
    } else {
      
      this.loading = this.indicator.create({
        showBackdrop: false,
        content: `<div>Loading...</div>`, 
        spinner: 'circles', 
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.player.checkOrDown({
        book: String(this.db.appInfo.view_bible_book),
        jang: String(this.db.appInfo.view_bible_jang)
      })
      .then(result => {
        this.playState = 'pause';
        console.log(result);
        if (this.loading) {
          this.loading.dismiss();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.loading) {
          this.loading.dismiss();
        }
      })
    }
  }

  stop() {
    this.player.stop();
  }

  move(direction:string, withPaly:boolean) {
    this.db.checkBibleContent(direction == 'prev' ? false : true)
      .then(result => {
        console.log(result);
        if (result.result == 'success' && result.msg == 'Y') {
          let moveStep = direction == 'prev' ? -1 : 1;
          this.db.updateAppInfo({
            book:this.db.appInfo.view_bible_book, 
            jang:this.db.appInfo.view_bible_jang + (moveStep)
          })
          .then(() => {
            this.getBibleWrap();

            if (withPaly && !this.playerNonVisible) {
              this.playOrPause();
            }

          })
          .catch(err => {
            console.log(err);
          })
          
        } else {
          this.toast.create({
            message: `해당 장에서 더이상 읽을 자료가 없습니다.`,
            duration: 3000,
            position: 'bottom'
          }).present();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  next(withPaly:boolean) {
    this.db.checkBibleContent(true)
      .then((result:any) => {
        console.log(result);
        if (result.result == 'success' && result.msg == 'Y') {
          this.db.updateAppInfo({
            book:this.db.appInfo.view_bible_book, 
            jang:this.db.appInfo.view_bible_jang
          })
          .then(() => {
            this.getBibleWrap();

            if (withPaly && !this.playerNonVisible) {
              this.playOrPause();
            }

          })
          .catch(err => {
            console.log(err);
          })
          
        } else {
          this.toast.create({
            message: `현재 보고있는 ${this.db.appInfo.book_name}의 마지막장 입니다.`,
            duration: 3000,
            position: 'bottom'
          }).present();
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  roopToggle() {
    this.isMediaRoop = !this.isMediaRoop;
  }
}
