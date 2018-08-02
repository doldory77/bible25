import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { UtilProvider } from '../../providers/util/util';
import { BibleLearnStateType } from '../../model/model-type';

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
  readCount: number = 0;
  listenCount: number = 0;
  totalLearnCount: number = 0;
  title: string = '성경통독';
  learn_title: string = '';

  isReadingSchedul: boolean = false;
  startReadingDate: string = '';
  endReadingDate: string = '';
  currDayCount: number = 0;
  totalDurationDayCount: number = 0;
  untilCurrDayPercent: string = "0%";
  untilCurrDayPercentByCeil: string = "0%";
  currDayLearnJangCount: number = 0;
  totalLearnJangCount: number = 0;
  untilCurrLearnJangPercent: string = "0%";
  untilCurrLearnJangPercentByCeil: string = "0%";
  untilCurrAvgJangCnt: string = "0";
  remainExpectationAvgJangCnt: string = "0";
  targetAmount: string = '1189';
  targetAmountName: string = '목표량 설정';

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.getLearnBibleData();
    this.getBibleLearnCount();
    this.getLearnInfo();
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
        
      })
      .catch(err => {
        console.error(err);
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
        console.error(err);
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

  getLearnInfo() {
    this.db.getLearnStateInfo()
      .then((result:BibleLearnStateType) => {
        this.isReadingSchedul = result.isLearn;
        this.startReadingDate = result.learn_start_dt;
        this.endReadingDate = result.learn_end_dt;
        this.currDayCount = result.currDayCount;
        this.totalDurationDayCount = result.totalDurationDayCount;
        this.untilCurrDayPercent = result.untilCurrDayPercent;
        this.untilCurrDayPercentByCeil = result.untilCurrDayPercentByCeil;
        this.currDayLearnJangCount = result.currDayLearnJangCount;
        this.totalLearnJangCount = result.totalLearnJangCount;
        this.untilCurrLearnJangPercent = result.untilCurrLearnJangPercent;
        this.untilCurrLearnJangPercentByCeil = result.untilCurrLearnJangPercentByCeil;
        this.untilCurrAvgJangCnt = result.untilCurrAvgJangCnt;
        this.remainExpectationAvgJangCnt = result.remainExpectationAvgJangCnt;
      })
      .catch(err => {
        console.error(err);
        this.isReadingSchedul = false;
        this.startReadingDate = this.util.getYYYYMMDD();
        this.endReadingDate = this.util.getYYYYMMDD();
        this.currDayCount = 0;
        this.totalDurationDayCount = 0;
        this.untilCurrDayPercent = "0%";
        this.untilCurrDayPercentByCeil = "0%";
        this.currDayLearnJangCount = 0;
        this.totalLearnJangCount = 0;
        this.untilCurrLearnJangPercent = "0%";
        this.untilCurrLearnJangPercentByCeil = "0%";
        this.untilCurrAvgJangCnt = "0";
        this.remainExpectationAvgJangCnt = "0";
      });
  }

  setReadingAmount(event) {
    this.targetAmount = event;
  }

  resetLearnBible() {
    this.util.showConformAlert(
      '설정초기화', 
      '이전까지 학습한 정보가 초기화 됩니다.\n초기화 하기겠습니까?',
      () => {
        this.db.updateLearnInfo({isReset:true})
          .then(result => {
            this.util.showToast('초기화되었습니다.', 2000);
            this.getLearnInfo()
          })
      }
   );
  }

  saveLearnConfig() {
    if (new Date(this.startReadingDate).getTime() > new Date(this.endReadingDate).getTime()) {
      this.util.showToast('시작날짜가 목표날짜보다 클 수 없습니다.', 2000);
      return;
    }
    let params = {
      isReset: false,
      learn_yn: this.isReadingSchedul ? 'Y' : 'N',
      learn_start_dt: this.startReadingDate,
      learn_end_dt: this.endReadingDate,
      learn_target_amount: Number(this.targetAmount)
    }
    this.db.updateLearnInfo(params)
      .then(result => {
        this.util.showToast('학습설정벙보를 저장하였습니다.', 2000);
        this.getLearnInfo();
      })
      .catch(err => {console.error(err)})
  }

}
