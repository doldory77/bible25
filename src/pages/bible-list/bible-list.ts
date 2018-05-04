import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db'

/**
 * Generated class for the BibleListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bible-list',
  templateUrl: 'bible-list.html',
})
export class BibleListPage {

  bibleType: number = 0;
  bibleHistoryName: string;
  viewMode: string = 'type1';
  viewModeIconName: string = 'menu';

  bibleList: {book:number, name:string, total_jang:number, bibletype:number}[] = [];
  bibleCurrentRange: number[] = [];
  bibleRangeMapByAllBook: Map<number, number[]> = new Map();



  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider) {
  }

  ionViewDidLoad() {

    this.db.getBibleListByType(0, this.bibleList)
      .then(data => {
      
      })
      .catch(err => console.error(err));

      this.db.getRangeMapByAllBook(this.bibleRangeMapByAllBook)
        .then(data => {
          this.showJangList(1, '창세기');
        })
        .catch(err => console.error(err));
  }

  changeViewMode() {
    if (this.viewMode === 'type2') {
      this.viewMode = 'type1';
      this.viewModeIconName = 'list-box';
    } else {
      this.viewMode = 'type2';
      this.viewModeIconName = 'apps';
    }
  }

  showJangList(book: number, name: string) {
    this.bibleCurrentRange = this.bibleRangeMapByAllBook.get(book);
    this.db.appInfo.book_name = name;
    this.db.appInfo.view_bible_book = book;
  }

  selectJang(jang: number) {
    this.db.appInfo.view_bible_jang = jang;
    let param: {book:number, jang:number} = {
      book: this.db.appInfo.view_bible_book,
      jang: this.db.appInfo.view_bible_jang
    }
    this.db.updateAppInfo('bible',param);
    setTimeout(() => {
      this.navCtrl.pop();
    }, 200);
  }

  selectBookAndJang(book:number, jang:number) {
    this.db.appInfo.view_bible_book = book;
    this.db.appInfo.view_bible_jang = jang;
    let param: {book:number, jang:number} = {
      book: this.db.appInfo.view_bible_book,
      jang: this.db.appInfo.view_bible_jang
    }
    this.db.updateAppInfo('bible',param);
    setTimeout(() => {
      this.navCtrl.pop();
    }, 200);
  }

  showList(type: number) {
    this.bibleType = type;
    if (type == 0) {
      this.bibleHistoryName = '구약';
    } else {
      this.bibleHistoryName = '신약';
    }
    
    this.db.getBibleListByType(type, this.bibleList)
      .then(data => {
        
      })
      .catch(err => console.error(err));
  }



}
