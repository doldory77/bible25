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

  bibleType: number = 0
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
    console.log('ionViewDidLoad BibleListPage');

    this.db.getBibleListByType(0, this.bibleList)
      .then(data => {
        // console.log(data);
        // console.log(this.bibleList);
      })
      .catch(err => console.log(err));

      this.db.getRangeMapByAllBook(this.bibleRangeMapByAllBook)
        .then(data => {
          // console.log(data);
          // console.log(this.bibleRangeMapByAllBook);
          this.showJangList(1);
        })
        .catch(err => console.log(err));
  }

  changeViewMode() {
    if (this.viewMode === 'type2') {
      this.viewMode = 'type1';
      this.viewModeIconName = 'menu';
    } else {
      this.viewMode = 'type2';
      this.viewModeIconName = 'home';
    }
  }

  showJangList(book: number) {
    this.bibleCurrentRange = this.bibleRangeMapByAllBook.get(book);
  }

  showList(type: number) {
    console.log(type);
    this.bibleType = type;
    this.db.getBibleListByType(type, this.bibleList)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }



}
