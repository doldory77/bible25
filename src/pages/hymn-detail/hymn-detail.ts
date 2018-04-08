import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { PlayerProvider } from '../../providers/player/player';
import { Observable, pipe, Subscription } from 'rxjs/Rx'
import { map } from 'rxjs/operators'

/**
 * Generated class for the HymnDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hymn-detail',
  templateUrl: 'hymn-detail.html',
})
export class HymnDetailPage {

  playState: string = 'play';
  mediaTraker: string = '0:0';
  mediaRange: string = '--:--';
  isMediaRoop: boolean = false;
  loading: Loading
  currentPnumber: string;
  trackerSubscription: Subscription;
  currentTrack: string = '5%';

  viewType: number = 0;

  audio: {p_num:string, subject:string, song:string} = {
    p_num: '',
    subject: '',
    song: ''
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private db: DbProvider,
    private player: PlayerProvider,
    private indicator: LoadingController,
    private toast: ToastController) {
      
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HymnDetailPage');
    let tmpPNumber = this.navParams.get('p_num');
    if (tmpPNumber) {
      this.db.updateAppInfo('hymn', {pnumber:tmpPNumber})
        .then(result => {
          console.log(result);
          this.getHymnDetail(tmpPNumber);
        })
        .catch(err => {console.log(err)});
    }
  }

  ionViewWillEnter() {
    console.log('===========> ionViewWillEnter');
    // this.trackerSubscription = this.startPlayBack();    
  }

  ionViewWillLeave() {
    console.log('===========> ionViewWillLeave');
    this.trackerSubscription.unsubscribe();
    if (this.player.isMediaObjectLive) {
      this.player.stop();
      this.player.release();
    }
  }

  getHymnDetail(p_num: string) {
    this.db.getHymnDetail(p_num)
      .then(rs => {
        this.audio.subject = rs.rows.item(0).subject;
        this.audio.p_num = rs.rows.item(0).p_num;
        this.audio.song = rs.rows.item(0).song.replace(/@/g, '<br/><br/>');
        console.log(this.audio);
      })
      .catch(err => {
        console.log(err);
      })
  }

  startPlayBack(): Subscription {
    return Observable.interval(500)
      .pipe(
        map(() => {
          this.player.getPosition()
            .then(data => {
              let totRangeNum = Math.floor(this.player.getDuration());
              let curTimeValNum = Math.ceil(data);
              let percentValNum = curTimeValNum / totRangeNum * 100;

              let minVal = Math.floor(curTimeValNum / 60);
              let secVal = Math.floor(curTimeValNum % 60);

              this.mediaTraker = minVal > 0 ? (minVal + ':' + this.db.pad(secVal,2)) : (this.db.pad(secVal,2) + '');
              this.currentTrack = String(percentValNum) + "%";
              
              if (curTimeValNum >= totRangeNum) {
                this.player.stop();
                this.playState = 'play';
                this.mediaTraker = "0"
                this.currentTrack = "1%";
              }

              // console.log(data);
            })
        })
      ).subscribe()
  }

  playOrPause2() {
    // 플레이중이면 일시정지
    if (this.playState == 'pause') {
      this.player.pause();
      this.playState = 'play';
      if (this.trackerSubscription) this.trackerSubscription.unsubscribe();
      return;
    }
    // 동일한 찬송이면 일시정지 풀기
    if (this.currentPnumber == this.db.appInfo.view_hymn_pnum) {
      console.log('이전:', this.currentPnumber, '지금:', this.db.appInfo.view_hymn_pnum);
      this.player.play();
      this.playState = 'pause';
      this.trackerSubscription = this.startPlayBack();
      return;
    }
    // 정지상태면 플레이
    this.db.getAppInfo()
      .then(() => {
        this.player.checkOrDownHymn(this.db.appInfo.view_hymn_pnum)
          .then(result => {
            
            setTimeout(() => {
              console.log('============> duration: ', this.player.getDuration());
              let durationNum = Math.floor(this.player.getDuration());
              let minVal = Math.floor(durationNum / 60);
              let secVal = durationNum % 60;
              this.mediaRange = minVal > 0 ? (minVal + ':' + this.db.pad(secVal,2)) : (this.db.pad(secVal,2) + '');
            }, 1000);

            this.playState = 'pause';
            this.trackerSubscription = this.startPlayBack();
            this.currentPnumber = this.db.appInfo.view_hymn_pnum;
          })
      })
  }

  move2(direction:string, withPaly:boolean) {
    let isNext = direction == 'next' ? true : false;
    this.db.checkHymnContent(isNext)
      .then(result => {
        if (result.result == 'success' && result.msg == 'Y') {
          let movePNum = isNext ? this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)+1,3) : this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)-1,3);
          console.log('===> movePage : ', movePNum);
          this.getHymnDetail(movePNum);
          // 이동하게되면 항상 찬송가 페이지번호를 업데이트
          this.db.updateAppInfo('hymn', {pnumber:movePNum});
          // 페이지 새로고침
          this.db.getAppInfo();
          try {
            this.player.stop();
            this.playState = 'play';
            if (this.trackerSubscription) this.trackerSubscription.unsubscribe();
          } catch (err) {console.log(err)}
        } 
      })
  }

  roopToggle() {
    this.isMediaRoop = !this.isMediaRoop;
    console.log('===========> duration: ', this.player.getDuration());
  }

}
