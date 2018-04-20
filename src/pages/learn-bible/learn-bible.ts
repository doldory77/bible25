import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Observable } from 'rxjs/Observable';
import { UtilProvider } from '../../providers/util/util';

@IonicPage()
@Component({
  selector: 'page-learn-bible',
  templateUrl: 'learn-bible.html',
})
export class LearnBiblePage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider,
    private util: UtilProvider) {
  }

  viewMode:number = 0;

  learnBibleBook:Map<number, {name:string, book:number}> = new Map();
  learnBibleData:{name:string, book:number, jang:number, isRead:boolean, isListen:boolean}[] = [];
  // loading: Loading;
  readCount: number = 0;
  listenCount: number = 0;
  totalLearnCount: number = 0;
  title: string = '성경통독';
  learn_title: string = '';

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.getLearnBibleData();
    this.getBibleLearnCount();
  }

  getLearnBibleData() {
    this.util.showSimpleLoading(2000);
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
        // if (this.loading) this.loading.dismiss();
        // console.log(this.learnBibleData);
      })
      .catch(err => {
        console.log(err);
        // if (this.loading) this.loading.dismiss();
      })
  }

  getBibleLearnCount() {
    this.db.getOnlyBibleLearnCount()
      .then(rs => {
        let item = rs.rows.item(0);
        this.readCount = item.read_count;
        this.listenCount = item.listen_count;
        this.totalLearnCount = item.total_learn_count;
        this.learn_title = `(읽기:${this.readCount}, 듣기:${this.listenCount})`;
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

  goContent(book:number, jang:number) {
    this.navCtrl.push('LearnBibleDetailPage', {viewMode:this.viewMode, book:book, jang:jang});
  }

}
