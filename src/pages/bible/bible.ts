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
import { UtilProvider } from '../../providers/util/util';

import { Pinchable } from '../../model/pinchable';
import { OnScrollDetect, ScrollDetectable } from '../../model/onscroll-detect';
import { PlayerUiComponent } from '../../components/player-ui/player-ui';

@IonicPage()
@Component({
  selector: 'page-bible',
  templateUrl: 'bible.html',
})
export class BiblePage extends Pinchable implements OnScrollDetect {

  @ViewChild(Content) content: Content;
  @ViewChild(PlayerUiComponent) playerUI: PlayerUiComponent;

  scrollDetector: ScrollDetectable;
  isShow: boolean = false;
  isBibleMode: boolean = true;
  menuData: MenuType[] = [];
  bibleBook: number = 1;
  bibleJang: number = 1;
  playerNonVisible = true;
  loading: Loading;
  bibleContents: {lang:string, book:number, jul:number, content:string, ord:number, isBookMarked:boolean, selected:boolean}[] = [];
  bibleSupportContents: {title:string, bible:string, context:string, img_name:string}[] = [];
  bookName: string = '';
  selectedLanguage: string = '';
  // data: any[] = [];
  isBookMarked: boolean = false;
  isBookMarkExists: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private menu: MenuProvider,
    private db: DbProvider,
    private indicator: LoadingController,
    private player: PlayerProvider,
    private toast: ToastController,
    private rest: RestProvider,
    private util: UtilProvider) {

      super();
      
      if (this.navParams.get('book')) this.bibleBook = this.navParams.get('book');
      if (this.navParams.get('jang')) this.bibleJang = this.navParams.get('jang');

      Array.from(this.menu.MenuData.keys())
        .filter(key => key.startsWith('bible_menu'))
        .forEach(key => {
          this.menuData.push(this.menu.MenuData.get(key));
        });

  }

  ionViewDidLoad() {
    this.menuData[0].selected = true;
    this.scrollDetector = new ScrollDetectable();
  }
  
  ionViewWillEnter() {
    this.onScrollBottomDetect(this.content);
    this.loadBible()
  }

  ionViewWillLeave() {
    this.destroyScrollDetector(this.scrollDetector);
  }

  saveBookMark() {
    let selectedJuls = this.bibleContents.filter(item => item.selected);
    if (selectedJuls.length == 0) {
      this.util.showAlert('즐겨찾기', '선택한 절이 없습니다.');
      return;
    }

    let julArr: number[] = [];
    selectedJuls.forEach(item => {
      julArr.push(item.jul);
    })
    
    let bookMark = {
      bibletype: this.util.getBibleType(this.bibleBook),
      book: this.bibleBook,
      jang: this.bibleJang,
      set_time: this.util.getToday(),
      julArr: julArr
    }
    this.db.insertBookMarkForBible(bookMark)
      .then(result => {
        this.util.showToast('즐겨찾기에 추가되었습니다.', 3000);
        this.refleshBibl();
        
      })
      .catch(err => {
        console.log(err);
        this.util.showToast('즐겨찾기에 실패하였습니다.', 3000);
      })
  }

  loadBible(book?:number, jang?:number) {
    this.db.getAppInfo()
      .then(info => {
        if (!this.util.isEmptyNumber(book)) {
          this.bibleBook = book;
        } else {
          this.bibleBook = this.util.isDefaultNumber(this.db.appInfo.view_bible_book, 1);
        }
        if (!this.util.isEmptyNumber(jang)) {
          this.bibleJang = jang;
        } else {
          this.bibleJang = this.util.isDefaultNumber(this.db.appInfo.view_bible_jang, 1);
        }

        this.bookName = this.db.appInfo.book_name;
        this.selectedLanguage = this.db.appInfo.selected_first_name;
        
        let params = {
          book: this.bibleBook,
          jang: this.bibleJang,
          multiLang: this.db.appInfo.selected_eng_names.split(',')
        }

        this.db.getBibleContent(this.bibleContents, params)
          .then(() => {
            this.content.scrollToTop();
          })
          .catch(err => {
            console.log(err);
          })
          
      })
  }

  refleshBibl() {
    this.isBookMarkExists = false;
    let params = {
      book: this.bibleBook,
      jang: this.bibleJang,
      multiLang: this.db.appInfo.selected_eng_names.split(',')
    }

    this.db.getBibleContent(this.bibleContents, params)
        .then(result => {})
        .catch(err => console.log(err));
  }
  
  onSubPage(menuNum: number) {
    this.menuData.forEach(menu => menu.selected = false);
    const menu = this.menuData[menuNum];
    menu.selected = true;
    
    this.screenUpdate();

    if (menuNum > 0) {
      this.isBibleMode = false;
      this.loading = this.indicator.create({
        showBackdrop: false,
        spinner: 'circles',
        cssClass: 'only-loading-icon', 
        dismissOnPageChange: true, 
      });
      this.loading.present();
      
      this.rest.getBibleSupportInfo(String(this.bibleBook), String(this.bibleJang), menu.url)
        .then(rs => {
          this.loading.dismiss();
          let tmpArr: any[] = (<any[]>rs);
          if (tmpArr.length > 0) {
            this.bibleSupportContents = [];
            tmpArr.forEach(item => {
              this.bibleSupportContents.push(item);
            })
            this.content.scrollToTop();
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

  screenUpdate(){
    this.content.resize();
  }

  togglePlayer() {
    this.playerNonVisible = !this.playerNonVisible;
    this.screenUpdate();
  }

  itemSelect(item:any) {
    item.selected = !item.selected;
    if (this.bibleContents.filter(item => item.selected).length > 0) {
      this.isBookMarkExists = true;
    } else {
      this.isBookMarkExists = false;
    }
  }

  onScrollBottomDetect(content:Content) {
    this.scrollDetector.onScrollBottomDetect(
      this.content,
      1000,
      data => {
        // console.log(data);
        if (this.isBibleMode == false) {
          this.isShow = false;
          return;
        }
        if (data.scrollTop + data.contentTop >= Math.floor(data.scrollHeight * 0.7)) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      },
      err => {console.log(err)},
    )
  }

  destroyScrollDetector(scrollDetector: ScrollDetectable) {
    scrollDetector.destroy();
  }

  forwardClick() {
    this.forward()
      .then((result:any) => {
        if (this.playerUI.playState == 1) {
          this.playerUI.directPlay(result.book, result.jang);    
        } else if (this.playerUI.playState == 2) {
          this.playerUI.book = result.book;
          this.playerUI.jang = result.jang;
          this.playerUI.stop();
        }
      })
  }

  backwardClick() {
    this.backward()
      .then((result:any) => {
        if (this.playerUI.playState == 1) {
          this.playerUI.directPlay(result.book, result.jang);
        } else if (this.playerUI.playState == 2) {
          this.playerUI.book = result.book;
          this.playerUI.jang = result.jang;
          this.playerUI.stop();
        }
      })
  }

  forward(): Promise<any> {
    return this.db.getLastJangByBibleBook(this.bibleBook)
      .then(rs => {
        let _book:number;
        let _jang:number;
        if (this.bibleJang + 1 > rs.rows.item(0).total_jang) {
          if (this.bibleBook + 1 <= 66) {
            _book = this.bibleBook + 1;
            _jang = this.bibleJang + 1;
          }
        } else {
          _book = this.bibleBook;
          _jang = this.bibleJang + 1;
        }

        this.db.updateAppInfo('bible', {book:_book, jang:_jang})
          .then(() => {
            this.loadBible();
          })

        return Promise.resolve({book:_book, jang:_jang})
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      })
  }

  backward(): Promise<any> {
    let _book:number;
    let _jang:number;
    if (this.bibleJang - 1 <= 0) {
      if (this.bibleBook - 1 > 0) {
        _book = this.bibleBook - 1;
        _jang = 1;
      }
    } else {
      _book = this.bibleBook;
      _jang = this.bibleJang - 1;
    }

    this.db.updateAppInfo('bible', {book:_book, jang:_jang})
      .then(() => {
        this.loadBible();
      })
    
    return Promise.resolve({book:_book, jang:_jang});
  }

  onPlayComplete(event) {
    console.log(event);
  }

  onForward(event) {
    // console.log(event)
    this.forward();
  }

  onBackward(event) {
    // console.log(event)
    this.backward();
  }
}
