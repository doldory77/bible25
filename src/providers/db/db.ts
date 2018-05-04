import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AppInfoType } from '../../model/model-type';
import { BibleLearnStateType } from '../../model/model-type';
import { UtilProvider } from '../util/util';

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
    private sqlite: SQLite,
    private util: UtilProvider) {
    console.log('Hello DbProvider Provider');
  }

  openDb(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.dbo) {
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

  getBibleContent(ref:{lang:string, book:number, jul:number, content:string, ord:number, isBookMarked:boolean, selected:boolean}[], 
    param:{book:number, jang:number, multiLang:string[]}): Promise<any> {
    
    let tmp: string = `select '#lang' lang, a.book, a.jul, a.content, #number ord,
      case when b.bibletype is null then 'N' else 'Y' end book_mark_yn
      from bible_#lang a
      left join bible_book_mark b on (a.book = b.book and a.jang = b.jang and a.jul = b.jul)
      where a.book = #bk and a.jang = #jg`;
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
              ord: item.ord,
              isBookMarked: item.book_mark_yn == 'Y' ? true : false,
              selected: false
            });
          }
          return Promise.resolve({result:'ok', msg:''});
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
      .catch(err => { return Promise.reject({result:'fail', msg:err})})
    
  }

  updateAppInfo(type:string, data:{book?:number, jang?:number, pnumber?:string}): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        if (type == 'bible') {
          return dbo.executeSql('update app_info set view_bible_book = ?, view_bible_jang = ?', [data.book, data.jang]);
        }
        else {
          return dbo.executeSql('update app_info set view_hymn_pnum = ?', [data.pnumber]);
        }
      })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  checkBibleContent(isNext: boolean): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        let param = '+ 1';
        if (!isNext) {
          param = '- 1';
        } 
        return dbo.executeSql(`
          select count(*) cnt from bible_nkrv
          where (book, jang) = (select view_bible_book, view_bible_jang ${param} from app_info limit 1)
        `, [])
      })
      .then(rs => {
        try {
          let flag = rs.rows.item(0).cnt > 0 ? 'Y' : 'N';
          return Promise.resolve({result:'success', msg:flag});
        } catch (err) {
          return Promise.reject({result:'fail', mag:err});
        }
      })
      .catch(err => {
        return Promise.reject({result:'fail', msg:err});
      });
  }

  public pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  checkHymnContent(isNext:boolean): Promise<any> {
    return this.getAppInfo()
      .then(() => {
        try {
          let movePNum: string = '';
          if (isNext) {
            movePNum = this.pad(parseInt(this.appInfo.view_hymn_pnum, 10)+1,3);
          } else {
            movePNum = this.pad(parseInt(this.appInfo.view_hymn_pnum, 10)-1,3);
          }

          if (movePNum == '000' || movePNum == '601') {
            return Promise.resolve({result:'success', msg:'N'});
          }
    
          return Promise.resolve({result:'success', msg:'Y'});
    
        } catch (err) {
          return Promise.reject({result:'fail', msg:err});
        }
      })
  }

  getHymnList(reqNumber:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        let query = "";
        if (reqNumber == 0) {
          query = "select p_num, p_num_old, subject from hymn";
          return dbo.executeSql(query, []);
        } else {
          let beginNum: string = '';
          let endNum: string = '';
          switch (reqNumber) {
            case 1:
              beginNum = '001'; endNum = '100';
              break;
            case 2:
              beginNum = '101'; endNum = '200';
              break;
            case 3:
              beginNum = '201'; endNum = '300';
              break;
            case 4:
              beginNum = '301'; endNum = '400';
              break;
            case 5:
              beginNum = '401'; endNum = '500';
              break;
            case 6:
              beginNum = '501'; endNum = '600';
          }
          query = `
            select p_num, p_num_old, subject from hymn
            where p_num between ? and ?
            order by p_num
          `;
          return dbo.executeSql(query, [beginNum, endNum]);
        }
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  getHymnCategory(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql('select cate_idx, cate_name from hymn_category where cate_idx != 0', [])
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  getHymnListByCategoryIdx(cateIdx:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select p_num, p_num_old, subject from hymn
          where cate_idx = ? order by p_num
        `, [cateIdx]);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  getHymnListBySearch(type:string, key:string): Promise<any> {
    // console.log(type, key)
    let query: string = 'select p_num, p_num_old, subject from hymn';
    
    switch (type) {
      case "0":
        query = query.concat(" where subject like '%'||?||'%'");
        break;
      case "1":
        query = query.concat(" where song like '%'||?||'%'");
        break;
      case "2":
        let pnum: string;
        try {
          pnum = this.util.pad(parseInt(key.replace(/[^0-9]/g,'')), 3);
          key = pnum;
        } catch (err) {
          console.error(err);
        }
        
        query = query.concat(" where p_num = ?");
    }
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        
        return dbo.executeSql(query, [key]);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  getHymnDetail(p_num: string): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql("select p_num, subject, replace(song,char(13)||char(10),'@') song from hymn where p_num = ?",[p_num]);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  getBibleLangList(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            selected,
            eng_name,
            case kor_name when '' then eng_name else kor_name end kor_name,
            downloaded
          from bible_db_name
          order by seq
        `, [])
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  bulkInsertBible(bibleArray:any[], lang:string): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.sqlBatch(
          [`create table if not exists bible_${lang} ( _id INTEGER PRIMARY KEY AUTOINCREMENT , book INTEGER, jang INTEGER, jul INTEGER, bibletype INTEGER, content TEXT, bname TEXT)`
            ,`update bible_db_name set downloaded = 'Y' where eng_name = upper('${lang}')`
          ].concat(bibleArray))
      })
  }

  updateSelectedBibleLang(selectedArray:any[]): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {  
        let sql = `update bible_db_name set selected = ? where eng_name = ?`;
        let sqlArr = [];
        selectedArray.forEach(item => {
          sqlArr.push([sql, item]);
        });
        console.log(sqlArr);
        return dbo.sqlBatch(sqlArr);
      })
  }

  insertBookMarkForBible(bookmark:{bibletype:number, book:number, jang:number, set_time:string, julArr:number[]}): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        let sql = "insert into bible_book_mark (bibletype, book, jang, jul, set_time) values (?,?,?,?,?)"
        let sqlArr: any[] = [];
        bookmark.julArr.forEach(jul => {
          sqlArr.push([sql, [bookmark.bibletype, bookmark.book, bookmark.jang, jul, bookmark.set_time]]);
        })
        return dbo.sqlBatch(sqlArr);

        // return dbo.executeSql(`
        //     insert into bible_book_mark (bibletype, book, jang, set_time)
        //     values (?,?,?,?,?)
        //   `, [0, bookmark.bibletype, bookmark.book, bookmark.jang, bookmark.set_time]);
      })
  }

  insertBookMarkHymn(bookmark:{p_num:string, set_time:string}): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
            insert into hymn_book_mark (p_num, set_time)
            values (?,?)
          `, [bookmark.p_num, bookmark.set_time]);
      })
  }

  getBookMarkForBible(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        // return dbo.executeSql(`
        //   select
        //     case a.bibletype when 0 then '구약성경' else '신약성셩' end bibletype,
        //     b.name,
        //     a.book,
        //     a.jang,
        //     a.set_time
        //   from new_book_mark a
        //   join bible_list_kr b on (a.book = b.book)
        //   where a.bookmark_type = 0
        // `,[]);
        return dbo.executeSql(`
          select
            case when a.bibletype = 0 then '구약성경' else '신약성경' end bibletype,
            b.name,
            a.book,
            a.jang,
            group_concat(a.jul, ', ') jul,
            a.set_time
          from bible_book_mark a
          join bible_list_kr b on (a.book = b.book)
          group by a.set_time
          order by a.set_time desc
        `,[])
      })
  }

  getBookMarkForHymn(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            a.p_num,
            b.p_num_old,
            b.subject,
            a.set_time
          from hymn_book_mark a
          join hymn b on (a.p_num = b.p_num)
          order by a.set_time desc 
        `,[]);
      })
  }

  // isBookMarkForBible(book:number, jang:number): Promise<boolean> {
  //   return this.openDb()
  //     .then((dbo: SQLiteObject) => {
  //       return dbo.executeSql(`
  //         select count(*) cnt from new_book_mark
  //         where bookmark_type = 0
  //         and book = ?
  //         and jang = ?
  //       `, [book, jang])
  //       .then(rs => {
  //         if (rs.rows.item(0).cnt == 0) {
  //           return Promise.resolve(false);
  //         } else {
  //           return Promise.resolve(true);
  //         }
  //       })
  //     });
  // }

  isBookMarkForHymn(p_num:string): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select count(*) cnt from hymn_book_mark
          where p_num = ?
        `,[p_num])
        .then(rs => {
          if (rs.rows.item(0).cnt == 0) {
            return Promise.resolve(false);
          } else {
            return Promise.resolve(true);
          }
        })
      });
  }

  deleteBookMarkForBible(set_time:string): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        // return dbo.executeSql('delete from new_book_mark where book = ? and jang = ?', [book, jang]);
        return dbo.executeSql('delete from bible_book_mark where set_time = ?', [set_time]);
      })
  }

  deleteBookMarkForHymn(p_num:string): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql('delete from hymn_book_mark where p_num = ?', [p_num]);
      })
  }

  getLearningInfo(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            learn_yn,
            learn_start_dt,
            learn_end_dt,
            learn_target_amount
          from app_info
        `, [])
      })
  }

  updateLearnInfo(param:{isReset:boolean, learn_yn?:string, learn_start_dt?:string, learn_end_dt?:string, learn_target_amount?:number}): Promise<any> {
    if (param.isReset) {
      return this.openDb()
        .then((dbo: SQLiteObject) => {
          return dbo.executeSql('delete from learn_bible',[])
            .then(() => {
              return this.dbo.executeSql(`
                update app_info set learn_start_dt = ?, learn_end_dt = ?
              `,[this.util.getYYYYMMDD(), this.util.getYYYYMMDD()]);
            })
        })
    } else {
      return this.openDb()
        .then((dbo: SQLiteObject) => {
          return dbo.executeSql(`
            update app_info set learn_yn = ?,
              learn_start_dt = ?,
              learn_end_dt = ?,
              learn_target_amount = ?          
          `, [param.learn_yn, param.learn_start_dt, param.learn_end_dt, param.learn_target_amount])
        })
    }
  }

  insertLearnBible(learn_type:number, book:number, jang:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        dbo.executeSql(`
          select 
            count(*) cnt,
            ifnull((select learn_yn from app_info),'N') learn_yn 
          from learn_bible 
          where learn_type = ? and book = ? and jang = ?
        `,[learn_type, book, jang])
          .then(rs => {
            if (rs.rows.item(0).cnt == 0 && rs.rows.item(0).learn_yn == 'Y') {
              return this.dbo.executeSql('insert into learn_bible (learn_type, book, jang) values (?, ?, ?)', [learn_type, book, jang]);
            } else {
              return Promise.resolve({result:'faile', msg:rs.rows.item(0).cnt + '/' + rs.rows.item(0).learn_yn})
            }
          })
      })
  }

  getLearnStateInfo(): Promise<BibleLearnStateType> {
    return new Promise((resolve, reject) => {

      let result: BibleLearnStateType = new BibleLearnStateType();
      result.isLearn = false;
      result.result = false;
      result.errMsg = "";
      result.learn_start_dt = this.util.getYYYYMMDD();
      result.learn_end_dt = this.util.getYYYYMMDD();
      result.today_dt = this.util.getYYYYMMDD();
      result.currDayCount = 0;
      result.totalDurationDayCount = 0;
      result.untilCurrDayPercent = "0";
      result.untilCurrDayPercentByCeil = "0%"; 
      result.currDayLearnJangCount = 0;
      result.totalLearnJangCount = 0;
      result.untilCurrLearnJangPercent = "0";
      result.untilCurrLearnJangPercentByCeil = "0%";

      this.openDb()
        .then((dbo: SQLiteObject) => {
          dbo.executeSql(`
            select
              learn_yn,
              learn_start_dt,
              learn_end_dt,
              case learn_target_amount when 0 then (select sum(total_jang) from bible_list_kr) else learn_target_amount end learn_target_amount,
              (select count(*) from (select count(*) from learn_bible group by book, jang)) learn_curr_amount
            from app_info
          `, [])
          .then(rs => {
            if (rs.rows.item(0).learn_yn) {
              if (rs.rows.item(0).learn_yn == 'Y') {
                try {
                  let startDt = new Date(rs.rows.item(0).learn_start_dt);
                  let endDt = new Date(rs.rows.item(0).learn_end_dt);
                  let todayDt = new Date(this.util.getYYYYMMDD());
                  
                  let currDayCount = (todayDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24) + 1;
                  let totalDurationDayCount = (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24) + 1;
                  
                  let untilCurrDayPercent = "0";
                  if (totalDurationDayCount > currDayCount) {
                    untilCurrDayPercent = (currDayCount / totalDurationDayCount * 100).toFixed(2);
                  }
                  let currDayLearnJangCount = rs.rows.item(0).learn_curr_amount;
                  let totalLearnJangCount = rs.rows.item(0).learn_target_amount;
                  let untilCurrLearnJangPercent = "0";
                  let untilCurrAvgJangCnt = "0";
                  let remainExpectationAvgJangCnt = "0";
                  if (currDayLearnJangCount > 0) {
                    untilCurrAvgJangCnt =  (currDayLearnJangCount / currDayCount).toFixed(2);
                    if (totalDurationDayCount > currDayCount) {
                      remainExpectationAvgJangCnt = ((totalLearnJangCount - currDayLearnJangCount) / (totalDurationDayCount - currDayCount)).toFixed(2);
                    } else {
                      remainExpectationAvgJangCnt = (totalLearnJangCount - currDayLearnJangCount) + "";
                    }
                    untilCurrLearnJangPercent = (currDayLearnJangCount / totalLearnJangCount * 100).toFixed(2);
                  }

                  result.isLearn = true;
                  result.result = true;
                  result.errMsg = "";
                  result.learn_start_dt = rs.rows.item(0).learn_start_dt;
                  result.learn_end_dt = rs.rows.item(0).learn_end_dt;
                  result.today_dt = this.util.getYYYYMMDD();
                  result.currDayCount = currDayCount;
                  result.totalDurationDayCount = totalDurationDayCount;
                  result.untilCurrDayPercent = untilCurrDayPercent;
                  result.untilCurrDayPercentByCeil = Math.ceil(Number(untilCurrDayPercent)) + "%";
                  result.currDayLearnJangCount = currDayLearnJangCount;
                  result.totalLearnJangCount = totalLearnJangCount;
                  result.untilCurrLearnJangPercent = untilCurrLearnJangPercent;
                  result.untilCurrLearnJangPercentByCeil = Math.ceil(Number(untilCurrLearnJangPercent)) + "%";

                  if (/[.]/.test(untilCurrAvgJangCnt)) {
                    if (untilCurrAvgJangCnt.split(".")[1].startsWith("00")) {
                      result.untilCurrAvgJangCnt = Math.floor(Number(untilCurrAvgJangCnt)) + "";
                    } else {
                      result.untilCurrAvgJangCnt = Math.floor(Number(untilCurrAvgJangCnt)) + " ~ " + Math.ceil(Number(untilCurrAvgJangCnt));
                    }
                  } else {
                    result.untilCurrAvgJangCnt = untilCurrAvgJangCnt;
                  }
                  if (/[.]/.test(remainExpectationAvgJangCnt)) {
                    if (remainExpectationAvgJangCnt.split(".")[1].startsWith("00")) {
                      result.remainExpectationAvgJangCnt = Math.floor(Number(remainExpectationAvgJangCnt)) + ""
                    } else {
                      result.remainExpectationAvgJangCnt = Math.floor(Number(remainExpectationAvgJangCnt)) + " ~ " + Math.ceil(Number(remainExpectationAvgJangCnt));
                    }
                  } else {
                    result.remainExpectationAvgJangCnt = remainExpectationAvgJangCnt
                  }

                  return resolve(result);

                } catch (err) {
                  result.errMsg = err;
                  return resolve(result);  
                }
              } else {
                result.errMsg = 'bible learning is not set';  
                return resolve(result);
              }
            } else {
              result.errMsg = 'bible learn info is empty';
              return resolve(result);
            }
          })
          .catch(err => {
            result.errMsg = err;
            return reject(result);
          })
        })
        .catch(err => {
          result.errMsg = err;
          return reject(result);
        })

    })
        
  }

  getLearnBibleData(): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            a.book,
            a.jang,
            b.name,
            case when c.learn_type is null then 'N' else 'Y' end reading_learn_yn,
            case when d.learn_type is null then 'N' else 'Y' end listening_learn_yn
          from (
            select
              book,
              jang
            from bible_nkrv
            group by book, jang
          ) a
          left join bible_list_kr b on (a.book = b.book)
          left join learn_bible c on (a.book = c.book and a.jang = c.jang and c.learn_type = 0)
          left join learn_bible d on (a.book = d.book and a.jang = d.jang and d.learn_type = 1)
        `,[])
      })
  }

  getLearnBibleContent(book:number, jang:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            a.book,
            a.jang,
            a.jul,
            a.content,
            case when b.learn_type is null then 'N' else 'Y' end read_learn_yn,
            case when c.learn_type is null then 'N' else 'Y' end listen_learn_yn
          from bible_nkrv a
          left join learn_bible b on (a.book = b.book and a.jang = b.jang and b.learn_type = 0)
          left join learn_bible c on (a.book = c.book and a.jang = c.jang and c.learn_type = 1)
          where a.book = ? and a.jang = ?
        `, [book, jang])
      })
  }

  getLearnBibleContentTitle(book:number, jang:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        let sql = "select case bibletype when 0 then '구약' else '신약' end bibletype, name, book, #jang jang from bible_list_kr where book = ?";
        return dbo.executeSql(sql.replace('#jang', String(jang)),[book])
      })
  }

  getLastJangByBibleBook(book:number): Promise<any> {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql("select total_jang from bible_list_kr where book = ?", [book]);
      })
  }

  getOnlyBibleLearnCount() {
    return this.openDb()
      .then((dbo: SQLiteObject) => {
        return dbo.executeSql(`
          select
            (select count(*) from learn_bible where learn_type = 0) read_count,
            (select count(*) from learn_bible where learn_type = 1) listen_count,
            (select count(*) from (select count(*) from learn_bible group by book, jang)) total_learn_count
        `, [])
      })
  }

}
