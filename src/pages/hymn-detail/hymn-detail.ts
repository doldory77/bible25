import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { PlayerProvider } from '../../providers/player/player';
import { Observable, pipe, Subscription } from 'rxjs/Rx'
import { map } from 'rxjs/operators';
import { UtilProvider } from '../../providers/util/util';
import { Pinchable } from '../../model/pinchable';

@IonicPage()
@Component({
  selector: 'page-hymn-detail',
  templateUrl: 'hymn-detail.html',
})
export class HymnDetailPage extends Pinchable {

  isBookMarked: boolean = false;

  viewType: number = 0;
  p_num: string = '001';
  subject: string = '';
  song: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private db: DbProvider,
    private player: PlayerProvider,
    private toast: ToastController,
    private util: UtilProvider) {
      super();
      if (this.navParams.get('p_num')) this.p_num = this.navParams.get('p_num');
  }

  ionViewDidLoad() {
    this.getHymnDetail(this.p_num);
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
    
  }

  getHymnDetail(p_num: string) {
    this.db.getHymnDetail(p_num)
      .then(rs => {
        this.subject = rs.rows.item(0).subject;
        this.p_num = rs.rows.item(0).p_num;
        this.song = rs.rows.item(0).song.replace(/@/g, '<br/><br/>');
        this.db.isBookMarkForHymn(p_num)
          .then(result => {

            if (result == true) {
              this.isBookMarked = true;
            } else {
              this.isBookMarked = false;
            }
          })
      })
      .catch(err => {
        console.log(err);
      })
  }

  saveBookMark() {
    let bookMark = {
      p_num: this.p_num,
      set_time: this.util.getToday()
    }
    this.db.insertBookMarkHymn(bookMark)
      .then(result => {
        this.util.showToast('즐겨찾기에 추가되었습니다.', 3000);
      })
      .catch(err => {
        console.log(err);
      })
  }

  forward() {
    let pnum = parseInt(this.p_num);
    if (pnum + 1 <= 600) {
      this.getHymnDetail(this.util.pad(pnum + 1, 3));
    } else {
      this.util.showToast('찬송가의 끝입니다.', 3000);
    }
  }

  backward() {
    let pnum = parseInt(this.p_num);
    if (pnum - 1 >= 0) {
      this.getHymnDetail(this.util.pad(pnum - 1, 3));
    } else {
      this.util.showToast('찬송가의 처음입니다.', 3000);
    }
  }

  onPlayComplete(event) {
    if (event.isAutoPlay) {
      this.forward();
    }
  }

  onForward(event) {
    this.forward();
  }

  onBackward(event) {
    this.backward();
  }

}
