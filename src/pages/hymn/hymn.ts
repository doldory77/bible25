import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PlayerComponent } from '../../components/player/player';
import { DbProvider } from '../../providers/db/db';

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

  topMenuData: {title:string, menuIdx:number, selected:boolean}[] = [];
  hymnData: {p_num:string, p_num_old:string, subject:string}[] = [];

  isNoneVisibleSearch: boolean = true;
  searchType: string = '0'
  searchKeyWord: string = '';
  selectOptions = {
    title: 'Pizza Toppings',
  };


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public db: DbProvider,
    public alertCtrl: AlertController) {

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
    // this.showList(1);
  }

  private topMenuHighlight(targetMenuIdx:number) {
    this.topMenuData.forEach(menu => menu.selected = false);
    this.topMenuData[targetMenuIdx].selected = true;
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

  execSearch() {
    alert('search do...')
  }

  showIndex() {
    this.alertCtrl.create({
      title: '분류검색',
      inputs: [
        {type:'radio', label:'AAA', value:'1'},
        {type:'radio', label:'AAA', value:'2'},
        {type:'radio', label:'AAA', value:'3'},
        {type:'radio', label:'AAA', value:'4'},
        {type:'radio', label:'AAA', value:'5'},
        {type:'radio', label:'AAA', value:'6'},
      ],
      buttons: [
        {
          text:'취소',
          role:'cancel'
        },
        {
          text:'검색',
          handler: data => {
            console.log(data);
          }
        }
      ]
    }).present();
  }

}
