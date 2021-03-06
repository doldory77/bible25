import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { Pinchable } from '../../model/pinchable';
import { OnScrollDetect, ScrollDetectable } from '../../model/onscroll-detect';

@IonicPage()
@Component({
  selector: 'page-learn-bible-detail',
  templateUrl: 'learn-bible-detail.html',
})
export class LearnBibleDetailPage extends Pinchable implements OnScrollDetect {

  scrollDetector: ScrollDetectable;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider) {
      super();
      if (navParams.get('book')) this.bibleBook = navParams.get('book');
      if (navParams.get('jang')) this.bibleJang = navParams.get('jang');
      if (navParams.get('viewMode')) this.learnMode = navParams.get('viewMode');
  }


  @ViewChild(Content) content: Content;

  learnMode:number = 0
  bibleTitle:string = '성경통독'
  bibleBook:number = 1;
  bibleJang:number = 1;
  bibleContents:{book:number, jang:number, jul:number, content:string, isReadYn:boolean, isListenYn:boolean}[] = [];

  listScrollEndSubscription: Subscription;
  isChecked: boolean = false;
  isShow: boolean = false;

  iframe: any;
  
  loadBible(book?:number, jang?:number) {
    console.log("loadBible()", book, " | ", jang);
    if (book && book > 0) this.bibleBook = book;
    if (jang && jang > 0) this.bibleJang = jang;

    this.getBibleContent(this.bibleBook, this.bibleJang);
    this.getBibleContentTitle(this.bibleBook, this.bibleJang);
  }

  ionViewDidLoad() {
    this.loadBible();
    this.scrollDetector = new ScrollDetectable();
    this.onScrollBottomDetect(this.content);

    this.iframe = document.getElementById('iframe_add2')['contentWindow'];
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
  
    this.destroyScrollDetector(this.scrollDetector);
  }

  onScrollBottomDetect(content:Content) {
    if (this.learnMode == 1) return;
    this.scrollDetector.onScrollBottomDetect(
      this.content,
      1000,
      data => {
        if (data.scrollTop >= Math.floor(data.contentHeight * 0.4)) {
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

  getBibleContentTitle(book:number, jang:number) {
    this.db.getLearnBibleContentTitle(book, jang)
      .then(rs => {
        let item = rs.rows.item(0);
        this.bibleTitle = `(${item.bibletype}) ${item.name} ${item.jang}장`;
      })
      .catch(err => {
        console.error(err);
      })
  }

  getBibleContent(book:number, jang:number) {
    this.db.getLearnBibleContent(book, jang)
      .then(rs => {
        this.bibleContents = [];
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.bibleContents.push({
            book: item.book,
            jang: item.jang,
            jul: item.jul,
            content: item.content,
            isReadYn: item.read_learn_yn == 'Y' ? true : false,
            isListenYn: item.listen_learn_yn == 'Y' ? true : false
          })
        }
        
        this.content.scrollToTop();

        if (this.bibleContents.length > 0) {
          if (this.learnMode == 0) {
            this.isChecked = this.bibleContents[0].isReadYn;
          } else {
            this.isChecked = this.bibleContents[0].isListenYn;
          }
          
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  forward() {
    this.iframe.location.reload(true);
    this.db.getLastJangByBibleBook(this.bibleBook)
      .then(rs => {
        if (this.bibleJang + 1 > rs.rows.item(0).total_jang) {
          if (this.bibleBook + 1 <= 66) {
            this.loadBible(this.bibleBook + 1, this.bibleJang + 1);
          }
        } else {
          this.loadBible(this.bibleBook, this.bibleJang + 1);
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  forward2(): Promise<any> {
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

  backward() {
    this.iframe.location.reload(true);
    if (this.bibleJang - 1 <= 0) {
      if (this.bibleBook - 1 > 0) {
        this.loadBible(this.bibleBook - 1, 1);
      }
    } else {
      this.loadBible(this.bibleBook, this.bibleJang - 1);
    }
  }

  check() {
    
    this.db.insertLearnBible(this.learnMode, this.bibleBook, this.bibleJang)
      .then(() => {
        this.forward();
      })
  }

  onPlayComplete(event) {
    if (this.isChecked == false) {
      this.db.insertLearnBible(this.learnMode, this.bibleBook, this.bibleJang)
        .then(result => {
          
        })
        .catch(err => {
          console.error(err);
        })
    }
  }

  onForward(event) {
    console.log("onForward() ===> ", event);
    this.forward();
  }

  onBackward(event) {
    this.backward();
  }

}
