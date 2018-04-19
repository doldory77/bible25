import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { PlayerProvider } from '../../providers/player/player';
import { UtilProvider } from '../../providers/util/util';
import { DbProvider } from '../../providers/db/db';
import { Loading } from 'ionic-angular';

const enum PlayKind {
  BibleMode = 0,
  HymnMode = 1
}

const enum PlayState {
  STOP = 0,
  PLAY = 1,
  PAUSE = 2
}

@Component({
  selector: 'player-ui',
  templateUrl: 'player-ui.html'
})
class PlayerUiComponent implements OnInit, OnDestroy {

  constructor(private player: PlayerProvider,
    private util: UtilProvider,
    private db: DbProvider) {
    
  }

  @Input() playerNonVisible = false; 
  @Input() playKind: PlayKind = PlayKind.BibleMode;

  @Input() book:number = 1;
  @Input() jang:number = 1;
  @Input() p_num:string = '001';
  loadingBar: Loading;

  playState: PlayState = PlayState.STOP;
  mediaTraker: string = '0:0';
  mediaRange: string = '--:--';
  currentTrack: string = '1%';
  
  trackerSubscription: Subscription;
  isMediaRoop: boolean = false;


  ngOnInit() {
    console.log("=====================> ngOnInit");
    this.trackerSubscription = this.playBack();
  }

  ngOnDestroy() {
    console.log("=====================> ngOnDestory");
    if (this.trackerSubscription) {
      this.trackerSubscription.unsubscribe();
    }
  }
  

  forward() {
    if (this.playKind == PlayKind.BibleMode) {
      this.db.getLastJangByBibleBook(this.book)
        .then(rs => {
          if (this.jang + 1 > rs.rows.item(0).total_jang) {
            this.util.showToast('페이지의 끝입니다.', 2000);
            return;
          } else {
            this.jang = this.jang + 1;
            this.play();
          }
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      if (parseInt(this.p_num) + 1 > 600) {
        this.util.showToast('페이지의 끝입니다.', 2000);
        return;
      } else {
        this.p_num = this.util.pad(parseInt(this.p_num) + 1, 3);
        this.play();
      }
    }
  }

  backward() {
    if (this.playKind == PlayKind.BibleMode) {
      if (this.jang - 1 <= 0) {
        this.util.showToast('페이지의 처음입니다.', 2000);
        return;
      } else {
        this.jang = this.jang - 1;
        this.play()
      }
    } else {
      if (parseInt(this.p_num) - 1 <= 0) {
        this.util.showToast('페이지의 처음입니다.', 2000);
        return;
      } else {
        this.p_num = this.util.pad(parseInt(this.p_num) - 1, 3);
        this.play();
      }
    }
  }

  command() {
    switch(this.playState) {
      case PlayState.STOP:
        this.play();
        break;
      case PlayState.PLAY:
        this.pause();
        break;
      case PlayState.PAUSE:
        this.resume();
        break;
    }
  }

  getPlayStateName() {
    if (this.playState == PlayState.STOP || this.playState == PlayState.PAUSE) {
      return 'play'
    } else {
      return 'pause'
    }
  }

  play() {
    
    this.stop();
    this.playState = PlayState.PLAY;

    if (this.playKind == PlayKind.BibleMode) {
      this.loadingBar = this.util.showSimpleLoading();
      this.player.checkOrDown({book:String(this.book), jang:String(this.jang)})
        .then(result => {
          console.log(result);
          this.dismissLoadingBar();
        })
        .catch(err => {
          console.log(err);
          this.dismissLoadingBar();
        })
    } else {
      this.player.checkOrDownHymn(this.p_num)
        .then(result => {
          console.log(result);
          this.dismissLoadingBar();
        })
        .catch(err => {
          console.log(err);
          this.dismissLoadingBar();
        })
    }
  }

  pause() {
    this.player.pause();
    this.playState = PlayState.PAUSE;
  }

  resume() {
    this.player.play();
    this.playState = PlayState.PLAY;
  }

  stop() {
    this.mediaTraker = '0:0';
    this.mediaRange = '--:--';
    this.currentTrack = '1%';
    this.player.stop();
    this.playState = PlayState.STOP;
  }

  dismissLoadingBar() {
    if (this.loadingBar) {
      this.loadingBar.dismiss();
    }
  }

  playBack(): Subscription {
    return Observable.interval(500)
      .pipe(
        map(() => {
          this.player.getPosition()
            .then(data => {
              let totRangeNum = Math.floor(this.player.getDuration());
              if (totRangeNum == 0) {totRangeNum = 1}
              let curTimeValNum = Math.ceil(data);
              let percentValNum = curTimeValNum / totRangeNum * 100;

              let minVal = Math.floor(curTimeValNum / 60);
              let secVal = Math.floor(curTimeValNum % 60);

              this.mediaTraker = minVal > 0 ? (minVal + ':' + this.db.pad(secVal,2)) : (this.db.pad(secVal,2) + '');
              this.currentTrack = String(percentValNum) + "%";

              let totMinVal = Math.floor(totRangeNum / 60);
              let totSecVal = totRangeNum % 60;
              this.mediaRange = totMinVal > 0 ? (totMinVal + ':' + this.db.pad(totSecVal,2)) : (this.db.pad(totSecVal,2) + '');
              
              if (curTimeValNum >= totRangeNum) {
                if (this.isMediaRoop) {
                  this.play();
                } else {
                  this.stop();
                }
              }

            })
        })
      ).subscribe();
  }

}

export { PlayKind, PlayState, PlayerUiComponent }
