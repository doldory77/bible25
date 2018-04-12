import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, ToastController } from 'ionic-angular';
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
    private indicator: LoadingController,
    private toast: ToastController) {
  }

  bibleLangDataPrifixUrl = "http://app.bible25.co.kr/Update/download_bible/#lang";
  bibleLangList: {selected:string, eng_name:string, kor_name:string, downloaded:string}[]; 
  loading: Loading;

  ionViewDidLoad() {
    this.getBibleLangList();
  }

  getBibleLangList() {
    this.db.getBibleLangList()
      .then(rs => {
        
        this.bibleLangList = [];

        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.bibleLangList.push({
            selected: item.selected,
            eng_name: item.eng_name,
            kor_name: item.kor_name,
            downloaded: item.downloaded
          });
        }

        // console.log(this.bibleLangList.values());

      })
      .catch(err => {
        console.log(err);
      })
  }

  nomalPath(localFilePath: string) {
    if (this.platform.is('ios')) {
      return localFilePath.replace(/^file:\/\//,'');
    } else {
      return localFilePath;
    }
  }

  strBibleToArray(file:string, lang:string): Promise<any> {
    let sql = `insert into bible_${lang} (_id, book, jang, jul, content, bname, bibletype) values (?,?,?,?,?,?,?)`;
    return new Promise((resolve, reject) => {
      
      try {
        let tmpArr = file.split(/\n|\r\n/);
        let resultArr:any[] = [];
        tmpArr.forEach(strLine => {
          let item:any[] = strLine.split('@@');
          item[0] = Number(item[0]);  //_id
          item[1] = Number(item[1]);  //book
          item[2] = Number(item[2]);  //jang
          item[3] = Number(item[3]);  //jul
          // 신약, 구약 구분
          if (item[1] <= 39) {
            item.push(0)
          } else {
            item.push(1)
          }
          resultArr.push([sql, item]);
        })
        resolve(resultArr);
      } catch (err) {
        reject(err);
      }

    })
  }

  downloadAndDbInsert(language: string) {
    let lang = language.toLocaleLowerCase();
    this.loading = this.indicator.create({
      showBackdrop: false,
      content:`
        <div>
          <div>파일을 로딩하고있습니다.</div>
        </div>
      `,
      spinner: 'dots',
      // cssClass: 'only-loading-icon',
      dismissOnPageChange: true, 
    });
    this.loading.present();

    this.download(lang)
      .then(result => {
        return this.readBibleFile(lang);
      })
      .then(bibleFile => {
        return this.strBibleToArray(bibleFile, lang);
      })
      .then(bibleArray => {
        return this.db.bulkInsertBible(bibleArray, lang);
      })
      .then(result => {
        return this.removeCacheBibleFile(lang);
      })
      .then(result => {
        console.log('data bulk insert process ok');
        this.getBibleLangList();
        if (this.loading) this.loading.dismiss();
      })
      .catch(err => {
        console.log(err);
        if (this.loading) this.loading.dismiss();
      })
  }

  removeCacheBibleFile(lang:string): Promise<any> {
    let path = this.file.cacheDirectory;
    if (this.platform.is('ios')) {
      path = this.nomalPath(path);
    }
    let file = lang.toLocaleLowerCase() + '.sql';

    return this.file.removeFile(path, file);
  }

  readBibleFile(lang:string): Promise<any> {
    let path = this.file.cacheDirectory;
    if (this.platform.is('ios')) {
      path = this.nomalPath(path);
    }
    let file = lang.toLocaleLowerCase() + '.sql';
    
    return this.file.readAsText(path, file)
  }

  download(lang: string): Promise<any> {
    
    let remoteFileUrl = this.bibleLangDataPrifixUrl.replace('#lang', lang.toLowerCase());
    let targetFile = this.file.cacheDirectory + lang.toLowerCase() + '.sql';
    let transferObj: FileTransferObject = this.fileTransfer .create();

    return transferObj.download(remoteFileUrl, targetFile)
  }

  toggleChecked(value:boolean, item:{selected:string, eng_name:string, kor_name:string, downloaded:string}) {
    if (value) {
      item.selected = 'Y';
    } else {
      item.selected = 'N';
    }
  }

  saveShowBibleList() {
    let cnt: number = 0;
    Observable.from(this.bibleLangList)
      .map(item => {return [item.selected, item.eng_name]})
      .do(item => {
        if (item[0] == 'Y') {
          cnt += 1;
        }
      })
      .reduce((acc, curr) => {acc.push(curr); return acc}, new Array<any>())
      .subscribe(
        resultArr => {
          if (cnt == 0) {
            this.toast.create({
              message: '1개 이상 성경[번역본]을 선택해야 합니다.',
              duration: 3000
            }).present();
            return
          }
          // console.log(resultArr);
          this.db.updateSelectedBibleLang(resultArr)
            .then(() => { 
              // this.db.getAppInfo();
              this.navCtrl.pop(); 
            })
            .catch(err => console.log(err));
        },
        err => console.log(err),
        () => console.log('complete') 
      );


  }


}
