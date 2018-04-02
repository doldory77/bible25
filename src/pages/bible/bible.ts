import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { SQLiteObject } from '@ionic-native/sqlite';

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

  data: any[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiblePage');
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

}
