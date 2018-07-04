import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { UtilProvider } from '../../providers/util/util';
import { BibleLearnStateType, BibleUser, Church, Code } from '../../model/model-type';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider,
    private util: UtilProvider,
    private rest: RestProvider) {
      this.tabMenu = new Map();
      this.tabMenu
        .set(0, {title:'즐겨찾기', selected:true})
        .set(1, {title:'성경통독', selected:false})
        // .set(2, {title:'개인정보수정', selected:false});
      
      
  }

  tabMenu: Map<number, {title:string, selected:boolean}>;
  currViewMode:number = 0;
  isBibleShow: boolean = true;
  isHymnShow: boolean = true;

  bibleBookMarkData:{bibletype:string, name:string, book:number, jang:number, jul:string, set_time:string}[] =[];
  hymnBookMarkData:{p_num:string, p_num_old:string, subject:string, set_time:string}[] =[];

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


  user: BibleUser = new BibleUser();
  churches: Church[] = [];
  ages: Code[] = [];
  genders: Code[] = [];
  purposes: Code[] = [];

  ionViewDidLoad() {
    /*
    Promise.all([
      this.rest.getUser('14259121'),
      this.rest.getChurches(),
      this.rest.getCode('001'),
      this.rest.getCode('003'),
      this.rest.getCode('002')
    ])
      .then((values:any[]) => {
        values.forEach((item, idx, arr) => {
          if (idx == 0) {
            if (!item.data || item.data.length == 0) {
              // TODO 사용자를 식별할 수 없을 경우 로그인 페이지로 이동
              // default
              this.user.age = '001';
              this.user.gender = '001';
              this.user.join_purpose = '001';
              this.user.church = 3;

            }
          }
          if (idx == 1) {
            this.churches = item.data;
          }
          if (idx == 2) {
            this.ages = item.data;
          }
          if (idx == 3) {
            this.genders = item.data;
          }
          if (idx == 4) {
            this.purposes = item.data;
          }
          
        })
      })
      .catch(error => console.error(error));
      */
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

  ionViewWillEnter() {
    
    this.getBookMarkForBible();
    this.getBookMarkForHymn();
    this.getLearnInfo();
    
  }

  getBookMarkForBible() {
    this.db.getBookMarkForBible()
      .then(rs => {
        this.bibleBookMarkData = [];
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.bibleBookMarkData.push({
            bibletype: item.bibletype,
            name: item.name,
            book: item.book,
            jang: item.jang,
            jul: item.jul,
            set_time: item.set_time
          })
        }
      })
      .catch(err => {console.error(err)})
  }

  getBookMarkForHymn() {
    this.db.getBookMarkForHymn()
      .then(rs => {
        this.hymnBookMarkData = [];
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.hymnBookMarkData.push({
            p_num: item.p_num,
            p_num_old: item.p_num_old,
            subject: item.subject,
            set_time: item.set_time
          })
        }
      })
      .catch(err => {console.error(err)})
  }

  getMenu() {
    return Array.from(this.tabMenu.values());
  }

  toggleTabMenu(i) {
    Array.from(this.tabMenu.values())
      .forEach(menu => {
        menu.selected = false;
      });
    let menu = this.tabMenu.get(i);
    menu.selected = true;

    this.currViewMode = i;
  }

  removeBibleBookMark(item:{bibletype:string, name:string, book:number, jang:number, set_time:string}) {
    this.util.showConformAlert('즐겨찾기삭제', '해당 북마크를 삭제하시겠습니까?', () => {

      this.db.deleteBookMarkForBible(item.set_time)
        .then(result => {
          this.util.showToast('즐겨찾기에서 삭제되었습니다.', 2000);
          this.getBookMarkForBible();
        })
        .catch(err => {
          console.error(err);
        });

    })
  }

  removeHymnBookMark(item:{p_num:string, p_num_old:string, subject:string, set_time:string}) {
    this.db.deleteBookMarkForHymn(item.p_num)
      .then(result => {
        this.util.showToast('즐겨찾기에서 삭제되었습니다.', 2000);
        this.getBookMarkForHymn();
      })
      .catch(err => {
        console.error(err);
      })
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

  goBibleContent(book:number, jang:number) {
    this.db.updateAppInfo('bibl',{book:book, jang:jang})
      .then(() => {
        this.navCtrl.push('BiblePage');
      })
  }

  goHymnContent(p_num:string) {
    this.navCtrl.push('HymnDetailPage', {p_num: p_num});
  }

}
