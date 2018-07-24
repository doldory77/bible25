import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Events } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { MenuType } from '../../model/model-type'
import { MenuProvider } from '../../providers/menu/menu'
import { Content } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { UtilProvider } from '../../providers/util/util';

import { Pinchable } from '../../model/pinchable';
import { OnScrollDetect, ScrollDetectable } from '../../model/onscroll-detect';
import { PlayerUiComponent } from '../../components/player-ui/player-ui';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { NativeAudio } from '@ionic-native/native-audio';
import { Clipboard } from '@ionic-native/clipboard';
import { ValueTransformer } from '../../../node_modules/@angular/compiler/src/util';


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
  speedBtnNonVisible = false;
  loading: Loading;
  bibleContents: {lang:string, book:number, jul:number, content:string, ord:number, isBookMarked:boolean, selected:boolean}[] = [];
  bibleSupportContents: {title:string, bible:string, context:string, img_name:string}[] = [];
  bookName: string = '';
  selectedLanguage: string = '개혁개정';
  isBookMarked: boolean = false;
  isBookMarkExists: boolean = false;
  currTitle: string = '성경';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private menu: MenuProvider,
    private db: DbProvider,
    private indicator: LoadingController,
    private rest: RestProvider,
    private util: UtilProvider,
    private nativeAudio: NativeAudio,
    private events: Events,
    private clipboard: Clipboard,
    private globalVars: GlobalVarsProvider) {

      super();
      
      if (this.navParams.get('book')) this.bibleBook = this.navParams.get('book');
      if (this.navParams.get('jang')) this.bibleJang = this.navParams.get('jang');

      Array.from(this.menu.MenuData.keys())
        .filter(key => key.startsWith('bible_menu'))
        .forEach(key => {
          this.menuData.push(this.menu.MenuData.get(key));
        });
      
      this.globalVars.getValueWithStorage('fontSize')
        .then(value => {
          this.fontSize = value + "em";
        }, error => {console.error(error)});
      this.globalVars.getValueWithStorage('fontColor')
        .then(value => {
          this.fontColor = value;
        }, error => {console.error(error)});
      this.globalVars.getValueWithStorage('backgroundColor')
        .then(value => {
          this.backgroundColor = value;
        }, error => {console.error(error)});

  }

  configPage() {
    this.nativeAudio.play('click', () => {});
    this.navCtrl.push('ConfigPage');
  }

  ionViewDidLoad() {
    this.menuData[0].selected = true;
    this.scrollDetector = new ScrollDetectable();
  }
  
  ionViewWillEnter() {
    // this.onScrollBottomDetect(this.content);
    this.loadBible();
    this.globalVars.getValueWithStorage('fontSize').then((value) => {
      this.fontSize = value + "em";
    });
    this.playerUI.stop();
  }

  ionViewWillLeave() {
    this.playerNonVisible = true;
    if (typeof this.fontSize === 'string') {
      this.fontSize = this.fontSize.replace('em', '');
    }
    this.globalVars.addValueWithStorage('fontSize', Number(this.fontSize));
    this.destroyScrollDetector(this.scrollDetector);
  }

  checkBookMark() {
    return this.bibleContents.findIndex(item => item.isBookMarked);
  }

  tmpNum: number = 92;
  saveBookMark() {
    // this.content.scrollTo(0, this.tmpNum, 300);
    // this.tmpNum += 92;
    // console.log("this.content.scrollHeight ==> ", this.content.scrollHeight);
    // return;
    
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
        this.isBookMarked = true;
      })
      .catch(err => {
        console.error(err);
        this.util.showToast('즐겨찾기에 실패하였습니다.', 3000);
      })
    
  }

  loadBible(book?:number, jang?:number) {
    this.db.getAppInfo()
      .then(info => {
        if (!this.util.isEmptyNumber(book)) {
          this.bibleBook = book;
        } else {
          let tmpBook = this.util.isDefaultNumber(this.db.appInfo.view_bible_book, 1);
          this.bibleBook = tmpBook;
        }
        if (!this.util.isEmptyNumber(jang)) {
          this.bibleJang = jang;
        } else {
          let tmpJang = this.util.isDefaultNumber(this.db.appInfo.view_bible_jang, 1);
          this.bibleJang = tmpJang;
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
            this.isBookMarked = (this.checkBookMark() > -1)
          })
          .catch(err => {
            console.error(err);
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
        .catch(err => console.error(err));
  }
  
  onSubPage(menuNum: number) {
    this.menuData.forEach(menu => menu.selected = false);
    const menu = this.menuData[menuNum];
    menu.selected = true;
    this.currTitle = menu.name;
    this.screenUpdate();

    if (menuNum > 0) {
      if (this.playerUI.playState == 1) {
        this.playerUI.command();
      }
      this.playerNonVisible = true;
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
          console.error(err);
        })
    } else {
      this.isBibleMode = true;
      if (this.playerUI.playState == 2) {
        this.playerNonVisible = false;
        this.playerUI.command();
      }
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

  itemAllDeSelect() {
    this.bibleContents.forEach((value, idx, arr) => {
      value.selected = false;
    });
    this.isBookMarkExists = false;
  }

  share() {
    var param = {
      title: '',
      subject: '',
      text: ''
    };
    var contents = [];
    this.bibleContents
      .filter(item => item.selected)
      .forEach(value => {
        contents.push('[' + this.bookName + ' ' + this.bibleJang + ':' + value.jul + '] ' + value.content);
      });
    if (contents.length > 0) {
      param.text = contents.join(',');
      window['cordova']
        .plugins
        .customPlugin
        .func('customPlugin', 'share', [param], (res) => {}, (err) => {alert(err)});
    }
  }

  clipboardCopy() {
    var contents = [];
    this.bibleContents
      .filter(item => item.selected)
      .forEach(value => {
        contents.push('[' + this.bookName + ' ' + this.bibleJang + ':' + value.jul + '] ' + value.content);
      });
      if (contents.length > 0) {
        this.clipboard.copy(contents.join(','));
        this.util.showToast('클립보드에 복사하였습니다.', 3000);
      }
  }  

  onScrollBottomDetect(content:Content) {
    this.scrollDetector.onScrollBottomDetect(
      this.content,
      1000,
      data => {
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
      err => {console.error(err)},
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
        console.error(err);
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
    
  }

  onForward(event) {
    this.forward();
  }

  onBackward(event) {
    this.backward();
  }

  scrollHandler(ev) {
    var dim: any =  this.content.getContentDimensions();
    // console.log('viewHeigh[', dim.contentHeight, '], totalHeigh[', dim.scrollHeight, '], distanceTop[', this.content.scrollTop, ']');
    if (dim.scrollHeight - 100 <= (dim.contentHeight + this.content.scrollTop)) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
}
