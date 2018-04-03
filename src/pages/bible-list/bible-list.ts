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

  bibleHistoryName: string = '구약'
  viewMode: string = 'type1';
  viewModeIconName: string = 'menu';

  bibleList: {book:number, name:string, total_jang:number, bibletype:number, range:number[]}[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BibleListPage');

    this.db.getBibleList(this.bibleList)
      .then(data => {
        // console.log(data);
        console.log(this.bibleList);
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

  showList(name: string) {

    console.log(name);
  }



}
