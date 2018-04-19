import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { PlayerProvider } from '../../providers/player/player';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ContentDimensions } from 'ionic-angular/components/content/content';
import { Pinchable } from '../../model/pinchable';

// const MAX_SCALE = 2.1;
// const MIN_SCALE = 0.9;
// const BASE_SCALE = 1.5;

@IonicPage()
@Component({
  selector: 'page-learn-bible-detail',
  templateUrl: 'learn-bible-detail.html',
})
export class LearnBibleDetailPage extends Pinchable {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider,
    private player: PlayerProvider) {
      super();
      if (navParams.get('book')) this.bibleBook = navParams.get('book');
      if (navParams.get('jang')) this.bibleJang = navParams.get('jang');
  }

  // public fontSize = `${BASE_SCALE}rem`;
  // private scale = BASE_SCALE;
  // private alreadyScaled = BASE_SCALE;
  // private isScaling = false;

  @ViewChild(Content) content: Content;

  learnMode:number = 0
  bibleTitle:string = '성경통독'
  bibleBook:number = 1;
  bibleJang:number = 1;
  bibleContents:{book:number, jang:number, jul:number, content:string, isReadYn:boolean, isListenYn:boolean}[] = [];

  listScrollEndSubscription: Subscription;
  isChecked: boolean = false;
  isShow: boolean = false;
  

  ionViewDidLoad() {
    this.getBibleContent(this.bibleBook, this.bibleJang);
    this.getBibleContentTitle(this.bibleBook, this.bibleJang);
  }

  checkScrollEnd() {
    this.listScrollEndSubscription = Observable.interval(1000)
      .map(() => {
        let dim: ContentDimensions = this.content.getContentDimensions();
        return {scrollTop:dim.scrollTop, scrollHeight:dim.scrollHeight, contentTop:dim.contentTop, contentHeight:dim.contentHeight}
      })
      .subscribe(
        data => {
          console.log(data);
          if (data.scrollTop >= data.contentHeight) {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
        },
        err => {console.log(err)},
        () => {}
      );
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
    if (this.listScrollEndSubscription) {
      this.listScrollEndSubscription.unsubscribe();
    }
  }

  getBibleContentTitle(book:number, jang:number) {
    this.db.getLearnBibleContentTitle(book, jang)
      .then(rs => {
        let item = rs.rows.item(0);
        this.bibleTitle = `(${item.bibletype}) ${item.name} ${item.jang}장`;
      })
      .catch(err => {
        console.log(err);
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
        if (this.bibleContents.length > 0) {
          this.isChecked = this.bibleContents[0].isListenYn || this.bibleContents[0].isReadYn;
          if (this.isChecked == false) {
            console.log('scroller monitor start =============');
            this.checkScrollEnd();
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  eventTrigger() {
    this.isShow = true;
  }

  // =================== PINCH ========================
  // public onPinchStart(e) {

  //   // flag that sets the class to disable scrolling
  //   // console.log('onPinchStart')
  //   this.isScaling = true;
  // }

  // // called at (pinchend) and (pinchcancel)
  // public onPinchEnd(e) {

  //   // flip the flag, enable scrolling
  //   this.isScaling = false;

  //   // adjust the amount we already scaled
  //   this.alreadyScaled = this.scale * this.alreadyScaled;
  //   // console.log('onPinchEnd')
  // }

  // public onPinchMove(e) {

  //   // set the scale so we can track it globally
  //   this.scale = e.scale;

  //   // total amount we scaled
  //   let totalScaled = this.alreadyScaled * e.scale;

  //   // did we hit the max scale (pinch out)
  //   if (totalScaled >= MAX_SCALE) {

  //     // fix the scale by calculating it, don't use the e.scale
  //     // scenario: an insane quick pinch out will offset the this.scale
  //     this.scale = MAX_SCALE / this.alreadyScaled;
  //     totalScaled = MAX_SCALE;

  //     // did we hit the min scale (pinch in)
  //   } else if (totalScaled <= MIN_SCALE) {

  //     // fix the scale
  //     this.scale = MIN_SCALE / this.alreadyScaled;
  //     totalScaled = MIN_SCALE;

  //   }

  //   let fontSize = Math.round(totalScaled * 10) / 10;

  //   // change the fontsize every 3 decimals in scale change
  //   if ((fontSize * 10) % 3 === 0) {

  //     // update the fontsize
  //     this.fontSize = `${fontSize}rem`;
  //   }

  // }
  // =================== PINCH ========================  

}
