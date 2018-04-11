import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer'
import { Observable } from 'rxjs/Observable'

@IonicPage()
@Component({
  selector: 'page-bible-lang',
  templateUrl: 'bible-lang.html',
})
export class BibleLangPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DbProvider,
    private fileTransfer: FileTransfer,
    private file: File,
    private platform: Platform,
    private indicator: LoadingController) {
  }

  bibleLangDataPrifixUrl = "http://app.bible25.co.kr/Update/download_bible/#lang";
  bibleLangList: Map<string, {selected:string, eng_name:string, kor_name:string, downloaded:string}> = new Map(); 
  loading: Loading;

  ionViewDidLoad() {
    console.log('ionViewDidLoad BibleLangPage');
    this.db.getBibleLangList()
      .then(rs => {
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.bibleLangList.set(item.eng_name, {
            selected: item.selected,
            eng_name: item.eng_name,
            kor_name: item.kor_name,
            downloaded: item.downloaded
          });
        }

        console.log(this.bibleLangList.values());

      })
      .catch(err => {
        console.log(err);
      })
  }

  getValue(): any[] {
    return  Array.from(this.bibleLangList.values())
  }

  nomalPath(localFilePath: string) {
    if (this.platform.is('ios')) {
      return localFilePath.replace(/^file:\/\//,'');
    } else {
      return localFilePath;
    }
  }

  downloadAndDbInsert(lang: string) {
    this.readBibleFile(lang)
      .then((file: string) => {
        // console.log(file.split(/\n|\r\n/))
        Observable.from(file.split(/\n|\r\n/))
          .map(value => {
            let tmp:any[] = value.split('@@');
            tmp[0] = Number(tmp[0]);  //_id
            tmp[1] = Number(tmp[1]);  //book
            tmp[2] = Number(tmp[2]);  //jang
            tmp[3] = Number(tmp[3]);  //jul
            // 신약, 구약 구분
            if (tmp[1] <= 39) {
              tmp.push(0)
            } else {
              tmp.push(1)
            }
            return [`insert into bible_${lang} (_id, book, jang, jul, content, bname, bibletype) values (?,?,?,?,?,?,?)`, tmp];
          })
          .reduce((acc, value) => [...acc, value],[])
          // .take(10)
          .subscribe(
            result => console.log(result),
            err => console.log(err),
            () => console.log('complete')
          );
      })
      .catch(err => {
        console.log(err);
      })
  }

  readBibleFile(lang:string): Promise<any> {
    let path = this.file.cacheDirectory;
    if (this.platform.is('ios')) {
      path = this.nomalPath(path);
    }
    let file = lang.toLocaleLowerCase() + '.sql';
    
    return this.file.readAsText(path, file)
      .then(value => {
        return Promise.resolve(value);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  download(lang: string): Promise<any> {
    
    let remoteFileUrl = this.bibleLangDataPrifixUrl.replace('#lang', lang.toLowerCase());
    let targetFile = this.file.cacheDirectory + lang.toLowerCase() + '.sql';
    let transferObj: FileTransferObject = this.fileTransfer .create();
    
    this.loading = this.indicator.create({
      showBackdrop: false,
      spinner: 'circles',
      cssClass: 'only-loading-icon',
      dismissOnPageChange: true, 
    });
    this.loading.present();

    return transferObj.download(remoteFileUrl, targetFile)
      .then(result => {
        if (this.platform.is('ios')) {
          targetFile = this.nomalPath(targetFile);
        }
        if (this.loading) this.loading.dismiss();
        return Promise.resolve({result:'ok', msg:targetFile});
      })
      .catch(err => {
        if (this.loading) this.loading.dismiss();
        return Promise.reject({result:'fail', msg:err});
      })
  }



}
