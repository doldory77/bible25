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
  bible_support_img_prefix_url = "http://chweb.biblesmartphone.co.kr/_bible_img/";

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

}
