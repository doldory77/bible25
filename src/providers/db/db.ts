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

}
