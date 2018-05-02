import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
// import { map } from 'rxjs/operators';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }
  
  bible_support_info_url = "http://ch2ho.bible25.com/m/bbs/board99.php?book=#book&jang=#jang&t=#tab";
  bible_code_url = "http://ch2ho.bible25.com/m/bbs/code.php";
  bible_support_img_prefix_url = "http://chweb.biblesmartphone.co.kr/_bible_img/";
  gyodok_content_url = "http://gyodok.bible25.co.kr/gyodok/gyodokContent?gyodok_id=#num";

  getBibleSupportInfo(book:string, jang:string, tab:string) {
    return new Promise((resolve, reject) => {
      
      let url = this.bible_support_info_url
        .replace('#book', book)
        .replace('#jang', jang)
        .replace('#tab', tab);

      this.http.get(url)
        .flatMap(data => {return Observable.from(<any[]>data)})
        .map(data => {
          data.context = data.context.replace(/(\n|\r\n)/g, '<br>');
          if (data.img_name != '') {
            data.img_name = this.bible_support_img_prefix_url.concat(data.img_name);
          }
          return data;
        })
        .reduce((acc, value) => [...acc, value],[])
        .subscribe(res => {
          resolve(res)
        }, err => {reject(err)});
    }); 
  }

  getGyodokContent(num:number): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.gyodok_content_url.replace('#num', String(num));
      this.http.get(url)
        .map((data:any) => {
          let contentArr:Array<string> = data.CONTENT.split('<br />');
          contentArr.forEach((value, idx, arr) => {
            arr[idx] = "<span>".concat(value).concat("</span>");
          })
          let result = {ID:data.ID, NO:data.NO, TITLE:data.TITLE, CONTENT:contentArr.join(''), CONTENT_ARR:contentArr}
          return result;
        })
        .subscribe(res => {
          resolve(res)
        }, err => {reject(err)});
    })
  }

  getChurches(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.bible_code_url, {api:'church_all'})
        .subscribe(
          (res: any) => {
            if (res.result == 'fail') {
              reject(res);
            }
            resolve(res);
          },
          err => {reject(err)}
        )
    })
  }

  getCode(parentCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.bible_code_url, {api:'code', parent_code:parentCode})
        .subscribe(
          (res: any) => {
            if (res.result == 'fail') {
              reject(res);
            }
            resolve(res);
          },
          err => {reject(err)}
        )
    })
  }

  getUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.bible_code_url, {api:'user', user_id:userId})
        .subscribe(
          (res: any) => {
            if (res.result == 'fail') {
              reject(res);
            }
            resolve(res);
          },
          err => {reject(err)}
        )
    })
  }
 
}
