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

  bibleAudioFile = {url:"http://bible25.bible25.com/bible_mp3.php?book=#book&jang=#jang", localName:"book#book_jang#jang.mp3"};
  hymnAudioFile = {url:"http://bible25.bible25.com/hymn_mp3.php?p_num=#p_num", localName:"hymn#p_num.mp3"};
  public currentBibleAudioData: {book:string, jang:string} = {book:'', jang:''};
  public currentHymnAudioData: {p_num:string} = {p_num:''};

  transferObj: FileTransferObject;
  mediaObj: MediaObject;

  constructor(private file: File,
    private fileTransfer: FileTransfer,
    private media: Media,
    private platform: Platform) {
      console.log('Hello PlayerProvider Provider');
  }

  nomalPath(localFilePath: string) {
    if (this.platform.is('ios')) {
      return localFilePath.replace(/^file:\/\//,'');
    } else {
      return localFilePath;
    }
  }

  checkOrDown(data: {book:string, jang:string}): Promise<any> {
    
    this.currentBibleAudioData.book = data.book;
    this.currentBibleAudioData.jang = data.jang;

    let localFile = this.bibleAudioFile.localName.replace('#book', data.book).replace('#jang', data.jang);
    return this.file.checkFile(this.file.cacheDirectory, localFile)
      .then(result => {
        // console.log('local file exists');
        this.initMedia(this.nomalPath(this.file.cacheDirectory+localFile))
          .play();
          return Promise.resolve({result:'ok', msg:'local file existes and play'});
      })
      .catch(err => {
        let remoteFile = this.bibleAudioFile.url.replace('#book', data.book).replace('#jang', data.jang);
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
    // console.log('start download');
    this.transferObj = this.fileTransfer.create();
    return this.transferObj.download(remoteFileUrl, targetFile)
      .then(result => {
        // console.log('file download success');
        this.initMedia(this.nomalPath(targetFile))
          .play();
          return Promise.resolve({result:'ok', msg:'file download success'});
      })
      .catch(err => {
        // console.log('===> ', 'download error: ', err);
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
      this.mediaObj.stop()
    }
  }

  isMediaObjectLive(): boolean {
    console.log('==============> curr mediaObj: ', this.mediaObj);
    if (this.mediaObj) {
      return true;
    } else {
      return false;
    }
  }

}
