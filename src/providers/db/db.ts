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

  getBibleList(ref:{book:number, name:string, total_jang:number, bibletype:number, range:number[]}[]): Promise<any> {

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
              range: Array.from(Array(item.total_jang).keys()).map(i => i+1)
            });
          }
          return Promise.resolve({result:'ok', msg:'success'});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => {return Promise.reject({result:'fail', msg:err})});

  }

}
