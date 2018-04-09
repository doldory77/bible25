import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, PopoverController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { HymnSearchTypeComponent } from '../../components/hymn-search-type/hymn-search-type';

/**
 * Generated class for the HymnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hymn',
  templateUrl: 'hymn.html',
})
export class HymnPage {

  @ViewChild(Content) content: Content;

  topMenuData: {title:string, menuIdx:number, selected:boolean}[] = [];
  hymnData: {p_num:string, p_num_old:string, subject:string}[] = [];
  hymnCategorys: {cate_idx:number, cate_name:string}[] = [];

  isNoneVisibleSearch: boolean = true;
  loading: Loading;

  searchType: {code:string, name:string} = {
    code:'0', name:'제목'
  }


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public db: DbProvider,
    public alertCtrl: AlertController,
    public indicator: LoadingController,
    private popoverCtrl: PopoverController) {

      this.topMenuData.push({title:'전체', menuIdx:0, selected:false});
      this.topMenuData.push({title:'100', menuIdx:1, selected:true});
      this.topMenuData.push({title:'200', menuIdx:2, selected:false});
      this.topMenuData.push({title:'300', menuIdx:3, selected:false});
      this.topMenuData.push({title:'400', menuIdx:4, selected:false});
      this.topMenuData.push({title:'500', menuIdx:5, selected:false});
      this.topMenuData.push({title:'600', menuIdx:6, selected:false});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HymnPage');
    this.getHymnCategory();
    this.showList(1);
  }

  private topMenuHighlight(targetMenuIdx:number) {
    this.topMenuData.forEach(menu => menu.selected = false);
    this.topMenuData[targetMenuIdx].selected = true;
  }

  screenUpdate(){
    this.content.resize();
  }

  toggleSearch() {
    this.isNoneVisibleSearch = !this.isNoneVisibleSearch;
    this.screenUpdate();
  }

  showDetail(pnum: string) {
    this.navCtrl.push('HymnDetailPage', {p_num:pnum});
  }

  getHymnCategory() {
    this.db.getHymnCategory()
      .then(rs => {
        this.hymnCategorys = [];
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.hymnCategorys.push({
            cate_idx: item.cate_idx,
            cate_name: item.cate_name
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  showList(menuIdx: number) {

    this.topMenuHighlight(menuIdx);

    this.db.getHymnList(menuIdx)
      .then(rs => {
        this.hymnData = [];
        for (var i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.hymnData.push({
            p_num: item.p_num,
            p_num_old: item.p_num_old,
            subject: item.subject
          });
        }
      })
      .catch(err => {
        console.log('==========> hymn data load error: ', err);
      })  
  }

  showListByCategoryIdx(cateIdx:number) {
    this.db.getHymnListByCategoryIdx(cateIdx)
      .then(rs => {
        this.hymnData = [];
        for (let i=0, max=rs.rows.length; i<max; i++) {
          let item = rs.rows.item(i);
          this.hymnData.push({
            p_num: item.p_num,
            p_num_old: item.p_num_old,
            subject: item.subject
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  execSearch(type:string, keyword:string) {
    console.log(type, keyword);
    // this.db.getHymnListBySearch(type, keyword)
    //   .then(rs => {
    //     this.hymnData = [];
    //     for (let i=0, max=rs.rows.length; i<max; i++) {
    //       let item = rs.rows.item(i);
    //       this.hymnData.push({
    //         p_num: item.p_num,
    //         p_num_old: item.p_num_old,
    //         subject: item.subject
    //       })
    //     }
    //   })
    //   .catch(err => {console.log(err)});
  }

  showIndex() {
    let radioArr: {type:string, label:string, value:any}[] = [];
    this.hymnCategorys.forEach(category => {
      radioArr.push({type:'radio', label:category.cate_name, value:category.cate_idx});
    });
    
    this.alertCtrl.create({
      title: '분류검색',
      inputs: radioArr,
      buttons: [
        {
          text:'취소',
          role:'cancel'
        },
        {
          text:'검색',
          handler: data => {
            console.log(data);
            this.showListByCategoryIdx(data);
          }
        }
      ]
    }).present();
  }

  showSearchType(myEvent) {
    let popover = this.popoverCtrl.create(HymnSearchTypeComponent, {searchType:this.searchType.code});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      console.log('receive data ===> ', data);
      this.searchType = data;
    });
  }

}
