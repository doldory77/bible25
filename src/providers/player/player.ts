import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';
import { Platform } from 'ionic-angular'
import { Injectable } from '@angular/core';

/*
  Generated class for the PlayerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlayerProvider {

  bibleAudioFile = {url:"http://bible25.bible25.com/bible_mp3_jyj.php?book=#book&jang=#jang&speed=#speed", localName:"book#book_jang#jang_speed#speed.mp3"};
  hymnAudioFile = {url:"http://bible25.bible25.com/hymn_mp3.php?p_num=#p_num", localName:"hymn#p_num.mp3"};
  public currentBibleAudioData: {book:string, jang:string} = {book:'', jang:''};
  public currentHymnAudioData: {p_num:string} = {p_num:''};

  transferObj: FileTransferObject;
  mediaObj: MediaObject;

  constructor(private file: File,
    private fileTransfer: FileTransfer,
    private media: Media,
    private platform: Platform) {
  }

  nomalPath(localFilePath: string) {
    if (this.platform.is('ios')) {
      return localFilePath.replace(/^file:\/\//,'');
    } else {
      return localFilePath;
    }
  }

  checkOrDown(data: {book:string, jang:string, speed:string}): Promise<any> {
    
    this.currentBibleAudioData.book = data.book;
    this.currentBibleAudioData.jang = data.jang;

    let localFile = this.bibleAudioFile.localName.replace('#book', data.book).replace('#jang', data.jang).replace('#speed', data.speed);
    return this.file.checkFile(this.file.cacheDirectory, localFile)
      .then(result => {
        this.initMedia(this.nomalPath(this.file.cacheDirectory+localFile))
          .play();
          return Promise.resolve({result:'ok', msg:'local file existes and play'});
      })
      .catch(err => {
        let remoteFile = this.bibleAudioFile.url.replace('#book', data.book).replace('#jang', data.jang).replace('#speed', data.speed);
        return this.download(remoteFile, this.file.cacheDirectory + localFile);
      });
  }

  checkOrDownHymn(p_num:string): Promise<any> {

    this.currentHymnAudioData.p_num = p_num;

    let localFile = this.hymnAudioFile.localName.replace('#p_num', p_num);
    return this.file.checkFile(this.file.cacheDirectory, localFile)
      .then(result => {
        
        this.initMedia(this.nomalPath(this.file.cacheDirectory+localFile))
          .play();
          return Promise.resolve({result:'ok', msg:'local file existes and play'});
      })
      .catch(err => {
        let remoteFile = this.hymnAudioFile.url.replace('#p_num', p_num);
        return this.download(remoteFile, this.file.cacheDirectory + localFile);
      });
  }

  download(remoteFileUrl: string, targetFile: string): Promise<any> {
    this.transferObj = this.fileTransfer.create();
    return this.transferObj.download(remoteFileUrl, targetFile)
      .then(result => {
        this.initMedia(this.nomalPath(targetFile))
          .play();
          return Promise.resolve({result:'ok', msg:'file download success'});
      })
      .catch(err => {
        return Promise.reject({result:'fail', msg:err});
      })
  }

  initMedia(downloadedFile: string): MediaObject {
    if (this.mediaObj) {
      this.mediaObj.release();
    }
    this.mediaObj = this.media.create(downloadedFile);
    return this.mediaObj;
  }

  play() {
    if (this.mediaObj) {
      this.mediaObj.play();
    }
  }

  pause() {
    if (this.mediaObj) {
      this.mediaObj.pause();
    }
  }

  stop() {
    if (this.mediaObj) {
      this.mediaObj.stop();
      this.release();
    }
  }

  release() {
    if (this.mediaObj) {
      this.mediaObj.release();
    }
  }

  isMediaObjectLive(): boolean {
    if (this.mediaObj) {
      return true;
    } else {
      return false;
    }
  }

  getDuration(): number {
    if (this.isMediaObjectLive()) {
      return this.mediaObj.getDuration();
    }
    return 0;
  }

  getPosition(): Promise<any> {
    if (this.isMediaObjectLive()) {
      return this.mediaObj.getCurrentPosition()
    }
    return Promise.resolve(0);
  }

}
