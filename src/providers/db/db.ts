import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AppInfoType } from '../../model/model-type';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  private dbo: SQLiteObject;
  public appInfo: AppInfoType = {
    view_bible_book: 1,
    book_name: '창세기',
    view_bible_jang: 1,
    view_hymn_pnum: '001',
    selected_first_name: '',
    selected_eng_names: ''
  }

  constructor(public http: HttpClient,
    private platform: Platform,
    private sqlite: SQLite) {
    console.log('Hello DbProvider Provider');
  }

  openDb(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.dbo) {
        console.log('==========> this.dbo is opened');
        resolve(this.dbo);
      } else {
        this.sqlite.create(this.getOptions())
          .then((dbo: SQLiteObject) => {
            this.dbo = dbo;
            resolve(dbo);
          })
          .catch(err => {
            reject(err);
          })
      }
    });
  }

  getOptions() {
    if (this.platform.is('android')) {
      return {
        name: 'godtube_bible.db',
        location: 'default',
        createFromLocation: 1
      }
    } else {
      return {
        name: 'godtube_bible.db',
        location: 'default',
        createFromLocation: 1
      }
    }
  }

  private referenceArrayClear(refArray: any[]) {
    for (let i=refArray.length; i>0; i--) {
      refArray.pop();
    }
  }

  getBibleList(ref:{book:number, name:string, total_jang:number, bibletype:number}[]): Promise<any> {

    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql("select * from bible_list_kr", {})
      })
      .then(rs => {
        try {
          for (let i=0, max=rs.rows.length; i<max; i++) {
            let item = rs.rows.item(i);
            ref.push({
              book: item.book,
              name: item.name,
              total_jang: item.total_jang,
              bibletype: item.bibletype,
            });
          }
          return Promise.resolve({result:'ok', msg:'success'});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => {return Promise.reject({result:'fail', msg:err})});

  }

  getBibleListByType(typeNo:number, ref:{book:number, name:string, total_jang:number, bibletype:number}[]): Promise<any> {

    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql("select * from bible_list_kr where bibletype = ?", [typeNo])
      })
      .then(rs => {
        try {
          this.referenceArrayClear(ref);
          for (let i=0, max=rs.rows.length; i<max; i++) {
            let item = rs.rows.item(i);
            ref.push({
              book: item.book,
              name: item.name,
              total_jang: item.total_jang,
              bibletype: item.bibletype,
            });
          }
          return Promise.resolve({result:'ok', msg:'success'});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => {return Promise.reject({result:'fail', msg:err})});

  }

  getRangeMapByAllBook(ref:Map<number, number[]>): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select a.book, group_concat(a.jang) range
          from (
            select book, jang 
            from bible_nkrv
            group by book, jang
          ) a
          group by a.book
          `, {})
      })
      .then(rs => {
        try {
          for (let i=0, max=rs.rows.length; i<max; i++) {
            let item = rs.rows.item(i);
            ref.set(item.book,item.range.split(','));
          }
          return Promise.resolve({result:'ok', msg:'success'});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => {return Promise.reject({result:'fail', msg:err})});
  }

  getAppInfo(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            view_bible_book,
            (select name from bible_list_kr where book = view_bible_book) book_name,
            view_bible_jang,
            view_hymn_pnum,
            (select ifnull(kor_name, eng_name) from bible_db_name where selected = 'Y' order by seq limit 1) selected_first_name,
            (select group_concat(lower(eng_name)) from bible_db_name where selected = 'Y') selected_eng_names
          from app_info
        `, [])
        .then(rs => {
          try {
            this.appInfo.view_bible_book = rs.rows.item(0).view_bible_book;
            this.appInfo.book_name = rs.rows.item(0).book_name;
            this.appInfo.view_bible_jang = rs.rows.item(0).view_bible_jang;
            this.appInfo.view_hymn_pnum = rs.rows.item(0).view_hymn_pnum;
            this.appInfo.selected_first_name = rs.rows.item(0).selected_first_name;
            this.appInfo.selected_eng_names = rs.rows.item(0).selected_eng_names;
            return Promise.resolve({result:'ok', msg:''});
          } catch (err) {
            return Promise.reject({result:'fail', msg:err});
          }
        })
        .catch(err => {return Promise.reject({result:'fail', msg:err})});
      })
      .catch(err => {return Promise.reject({result:'fail', msg:err})});
  }

  getBibleContent(ref:{lang:string, book:number, jul:number, content:string, ord:number}[], 
    param:{book:number, jang:number, multiLang:string[]}): Promise<any> {
    
    let tmp: string = "select '#lang' lang, book, jul, content, #number ord from bible_#lang where book = #bk and jang = #jg";
    tmp = tmp.replace('#bk', String(param.book)).replace('#jg', String(param.jang));
    let query: string = '';

    if (param.multiLang.length > 1) {
      param.multiLang.forEach((value, idx, arr) => {
        if (idx == 0) {
          query = query.concat(
            tmp.replace('#number', String(idx+1))
              .replace(/#lang/g, value)
          );
        } else {
          query = query.concat(' union ').concat(
            tmp.replace('#number', String(idx+1))
              .replace(/#lang/g, value)
          );
        }
      });
      query = query.concat(' order by jul, ord');
    } else {
      query = tmp.replace('#number', String(1))
        .replace(/#lang/g, param.multiLang[0])
    }

    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(query, []);
      })
      .then(rs => {
        try {
          this.referenceArrayClear(ref);
          for (let i=0, max=rs.rows.length; i<max; i++) {
            let item = rs.rows.item(i);
            ref.push({
              lang: item.lang,
              book: item.book,
              jul: item.jul,
              content: item.content,
              ord: item.ord
            });
          }
          return Promise.resolve({result:'ok', msg:''});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => { return Promise.reject({result:'fail', msg:err})})
    
  }

}
