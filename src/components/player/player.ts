import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';

/**
 * Generated class for the PlayerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {

  text: string;

  constructor(private file: File,
    private fileTransfer: FileTransfer,
    private media: Media) {
      console.log('Hello PlayerComponent Component');
      this.text = 'Hello World';
      this.myFiles.push({url:'http://bible25.bible25.com/bible_mp3.php?book=1&jang=3', file:'book1jang3.mp3'});
      this.myFiles.push({url:'http://bible25.bible25.com/bible_mp3.php?book=2&jang=4', file:'book2jang4.mp3'});
  }

  myFiles: any[] = [];
  transfer: FileTransferObject;

  mediaObj: MediaObject;

  download(idx: number) {
    console.log('===> ', 'start download');
    this.transfer = this.fileTransfer.create();
    this.transfer.download(this.myFiles[idx]['url'], this.file.cacheDirectory+this.myFiles[idx]['file'])
      .then(result => {
        console.log('===> ', 'file download success');
        this.initMedia((this.file.cacheDirectory+this.myFiles[idx]['file']).replace(/^file:\/\//,''))
          .play();
      })
      .catch(err => {
        console.log('===> ', 'download error: ', err)
      })
    console.log("==============");  
  }

  checkOrDown(idx: number) {
    this.file.checkFile(this.file.cacheDirectory, this.myFiles[idx]['file'])
      .then(result => {
        console.log('local file exiests');
        this.initMedia((this.file.cacheDirectory+this.myFiles[idx]['file']).replace(/^file:\/\//,''))
          .play();
      })
      .catch(error => {
        this.download(idx);
      })
  }

  initMedia(localFile: string): MediaObject {
    if (this.mediaObj) {
      this.mediaObj.release();
    }
    this.mediaObj = this.media.create(localFile);
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

}
