import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { SQLiteObject } from '@ionic-native/sqlite';
import { MenuType } from '../../model/model-type'
import { MenuProvider } from '../../providers/menu/menu'
import { Content } from 'ionic-angular';
import { PlayerProvider } from '../../providers/player/player';
import { Observable, pipe, Subscription } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { RestProvider } from '../../providers/rest/rest';

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
  // iframe: any;
  loading: Loading;
  bibleContents: {lang:string, book:number, jul:number, content:string, ord:number}[] = [];
  bibleSupportContents: {title:string, bible:string, context:string, img_name:string}[] = [];

  currBookName: string = '';
  currJangNumber: number = 0;
  currSelectedLanguage: string = '';
  isChange: boolean = false;

  playerNonVisible = true;
  playState: string = 'play';
  mediaTraker: string = '0:0';
  mediaRange: string = '--:--';
  isMediaRoop: boolean = false;

  currentPnumber: string;
  trackerSubscription: Subscription;
  currentTrack: string = '5%';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private menu: MenuProvider,
    private db: DbProvider,
    private indicator: LoadingController,
    private player: PlayerProvider,
    private toast: ToastController,
    private rest: RestProvider) {

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
    // this.iframe = document.getElementById('iframe2')['contentWindow'];
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

  ionViewWillLeave() {
    console.log('===========> ionViewWillLeave');
    this.trackerSubscription.unsubscribe();
    if (this.player.isMediaObjectLive) {
      this.player.stop();
      this.player.release();
    }
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
      // this.iframe.location.href = menu.url;
      // this.db.appInfo.view_bible_book = 1;
      // this.db.appInfo.view_bible_jang = 1;
      this.rest.getBibleSupportInfo(String(this.db.appInfo.view_bible_book), String(this.db.appInfo.view_bible_jang), menu.url)
        .then(rs => {
          // console.log('======> ', rs);
          this.loading.dismiss();
          let tmpArr: any[] = (<any[]>rs);
          if (tmpArr.length > 0) {
            this.bibleSupportContents = [];
            tmpArr.forEach(item => {
              this.bibleSupportContents.push(item);
            })
          }

        })
        .catch(err => {
          this.loading.dismiss();
          console.log(err);
        })
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
      if (this.trackerSubscription) this.trackerSubscription.unsubscribe();
      return;
    }

    if (this.canOnlyPaly()) {
      this.player.play();
      this.playState = 'pause';
      this.trackerSubscription = this.startPlayBack();
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

        setTimeout(() => {
          console.log('============> duration: ', this.player.getDuration());
          let durationNum = Math.floor(this.player.getDuration());
          let minVal = Math.floor(durationNum / 60);
          let secVal = durationNum % 60;
          this.mediaRange = minVal > 0 ? (minVal + ':' + this.db.pad(secVal,2)) : (this.db.pad(secVal,2) + '');
        }, 1000);

        this.playState = 'pause';
        this.trackerSubscription = this.startPlayBack();
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
          this.db.updateAppInfo('bible',{
            book:this.db.appInfo.view_bible_book, 
            jang:this.db.appInfo.view_bible_jang + (moveStep)
          })
          .then(() => {
            this.getBibleWrap();

            this.db.getAppInfo();
            try {
              this.player.stop();
              this.playState = 'play';
              this.mediaTraker = "0"
              this.currentTrack = "1%";
              this.mediaRange = '--:--';
              if (this.trackerSubscription) this.trackerSubscription.unsubscribe();
            } catch (err) {console.log(err)}

            // if (withPaly && !this.playerNonVisible) {
            //   this.playOrPause();
            // }

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

  roopToggle() {
    this.isMediaRoop = !this.isMediaRoop;
    this.rest.getBibleSupportInfo('1','1','tab1')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  startPlayBack(): Subscription {
    return Observable.interval(500)
      .pipe(
        map(() => {
          this.player.getPosition()
            .then(data => {
              let totRangeNum = Math.floor(this.player.getDuration());
              let curTimeValNum = Math.ceil(data);
              let percentValNum = curTimeValNum / totRangeNum * 100;

              let minVal = Math.floor(curTimeValNum / 60);
              let secVal = Math.floor(curTimeValNum % 60);

              this.mediaTraker = minVal > 0 ? (minVal + ':' + this.db.pad(secVal,2)) : (this.db.pad(secVal,2) + '');
              this.currentTrack = String(percentValNum) + "%";
              
              if (curTimeValNum >= totRangeNum) {
                this.player.stop();
                this.playState = 'play';
                this.mediaTraker = "0"
                this.currentTrack = "1%";
              }

              // console.log(data);
            })
        })
      ).subscribe()
  }
}
