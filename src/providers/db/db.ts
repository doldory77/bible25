import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  private 

  constructor(public http: HttpClient,
    private platform: Platform,
    private sqlite: SQLite) {
    console.log('Hello DbProvider Provider');
  }

  openDb() {
    return this.sqlite.create(this.getOptions());
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

}
