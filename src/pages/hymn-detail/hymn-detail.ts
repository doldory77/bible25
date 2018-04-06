import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { PlayerProvider } from '../../providers/player/player';

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
          this.getHymnDetail(this.db.appInfo.view_hymn_pnum);
        })
        .catch(err => {console.log(err)});
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

  canOnlyPaly(): boolean {
    return false;
    // const flag = this.player.isMediaObjectLive();
    // if (flag && this.oldHymnPNumber == String(this.db.appInfo.view_hymn_pnum)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  playOrPause2() {
    this.player.checkOrDownHymn(this.db.appInfo.view_hymn_pnum)
      .then(result => {
        console.log(result);
        this.playState = 'pause';
      })
  }

  move2(direction:string, withPaly:boolean) {
    this.db.checkHymnContent(direction == 'prev' ? false : true)
      .then(result => {
        if (result.result == 'success' && result.msg == 'Y') {
          let movePNum = direction == 'prev' ? this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)-1,3) : this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)+1,3);
          console.log('===> movePage : ', movePNum);
          this.getHymnDetail(movePNum);
          this.db.updateAppInfo('hymn', {pnumber:movePNum})
        } 
      })
  }

  playOrPause() {
    
    if (this.playState == 'pause') {
      this.player.pause();
      this.playState = 'play';
      console.log('==> current file play');
      return;
    }

    if (this.canOnlyPaly()) {
      
      this.player.play();
      this.playState = 'pause';
    } else {
      
      this.loading = this.indicator.create({
        showBackdrop: false,
        content: `<div>Loading...</div>`, 
        spinner: 'circles', 
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.player.checkOrDownHymn(this.db.appInfo.view_hymn_pnum)
      .then(result => {
        this.playState = 'pause';
        console.log(result);
        if (this.loading) {
          this.loading.dismiss();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.loading) {
          this.loading.dismiss();
        }
      })
    }
  }

  move(direction:string, withPaly:boolean) {
    this.db.checkHymnContent(direction == 'prev' ? false : true)
      .then(result => {
        console.log(result);
        if (result.result == 'success' && result.msg == 'Y') {

          let movePNum = direction == 'prev' ? this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)-1,3) : this.db.pad(parseInt(this.db.appInfo.view_hymn_pnum, 10)+1,3);
          this.db.updateAppInfo('hymn',{
            pnumber: movePNum
          })
          .then(() => {
            this.getHymnDetail(movePNum);

            if (withPaly) {
              this.playOrPause();
            }

          })
          .catch(err => {
            console.log(err);
          })
          
        } else {
          this.toast.create({
            message: `해당 장에서 더이상 읽을 자료가 없습니다.`,
            duration: 3000,
            position: 'bottom'
          }).present();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  roopToggle() {
    this.isMediaRoop = !this.isMediaRoop;
  }

}
