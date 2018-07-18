import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { UtilProvider } from '../../providers/util/util';
import { Pinchable } from '../../model/pinchable';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'page-hymn-detail',
  templateUrl: 'hymn-detail.html',
})
export class HymnDetailPage extends Pinchable {

  @ViewChild(Content) content: Content;
  isBookMarked: boolean = false;

  viewType: number = 0;
  p_num: string = '001';
  subject: string = '';
  song: string = '';
  playerNonVisible: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private db: DbProvider,
    private util: UtilProvider,
    private imageViewerCtrl: ImageViewerController) {
      super();
      if (this.navParams.get('p_num')) this.p_num = this.navParams.get('p_num');
  }

  ionViewDidLoad() {
    this.getHymnDetail(this.p_num);
    setTimeout(() => {
      this.playerNonVisible = false;
      this.content.resize();
    }, 300);
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
    this.playerNonVisible = true;
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
        console.error(err);
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
        console.error(err);
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

  presentImage(musicElement) {
    const imageViewer = this.imageViewerCtrl.create(musicElement);
    imageViewer.present();
  }

}
