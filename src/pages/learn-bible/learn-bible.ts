import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-learn-bible',
  templateUrl: 'learn-bible.html',
})
export class LearnBiblePage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider) {
  }

  viewMode:string = '0';

  learnBibleBook:Map<number, {name:string, book:number}> = new Map();
  learnBibleData:{name:string, book:number, jang:number, isRead:boolean, isListen:boolean}[] = [];
  // learnBibleReadingData:{name:string, book:number, jang:{jang:number, isRead:boolean, isListen:boolean}[]}[] = [];
  // learnBibleListeningData:{name:string, book:number, jang:{jang:number, isRead:boolean, isListen:boolean}[]}[] = [];

  ionViewDidLoad() {
    this.getLearnBibleData();
  }

  getLearnBibleData() {
    this.db.getLearnBibleData()
      .then(rs => {
        this.learnBibleData = [];
        for(let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.learnBibleData.push({
            name: item.name,
            book: item.book,
            jang: item.jang,
            isRead: item.reading_learn_yn == 'Y' ? true : false,
            isListen: item.listening_learn_yn == 'Y' ? true : false
          })
        }
        this.learnBibleData.forEach(item => {
          this.learnBibleBook.set(item.book, {name:item.name, book:item.book});
        })
        console.log(this.learnBibleData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  getBibleBookTitle() {
    return Array.from(this.learnBibleBook.values());
  }

  getBibleJangByBook(book:number) {
    return this.learnBibleData.filter(item => item.book == book)
  }

  setColor(item:{name:string, book:number, jang:number, isRead:boolean, isListen:boolean}) {
    if (this.viewMode == '0') {
      if (item.isRead)
        return 'orange';
      else
        return 'yellow';
    }
    if (this.viewMode == '1') {
      if (item.isListen)
        return 'orange'
      else
        return 'yellow';
    }
  }

  goContent(book:number, jang:number) {
    this.navCtrl.push('LearnBibleDetailPage', {book:book, jang:jang});
  }

}
