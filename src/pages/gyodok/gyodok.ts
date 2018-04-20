import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { UtilProvider } from '../../providers/util/util';
import { Pinchable } from '../../model/pinchable'

@IonicPage()
@Component({
  selector: 'page-gyodok',
  templateUrl: 'gyodok.html',
})
export class GyodokPage extends Pinchable {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private rest: RestProvider,
    private util: UtilProvider) {
      super();
      this.tabMenu = new Map();
      this.tabMenu
        .set(0, {title:'교독문', selected: true})
        .set(1, {title:'주기도문', selected: false})
        .set(2, {title:'사도긴경', selected: false});
  }

  
  
  tabMenu: Map<number, {title:string, selected:boolean}>;
  currViewMode: number = 0;
  gyodokMode: number = 0;
  playerMode: number = 0;
  creedMode: number = 0;

  gyodokModeNumbersO = Array(136).fill(0).map((x,i) => i+1);
  gyodokModeNumbers1 = Array(76).fill(0).map((x,i) => i+138);

  gyodokItem: {CONTENT:string, ID:number, NO:number, TITLE:string};
  gyodokContent: string;

  ionViewDidLoad() {
    
  }

  getMenu() {
    return Array.from(this.tabMenu.values());
  }

  toggleTabMenu(i) {
    Array.from(this.tabMenu.values())
      .forEach(menu => {
        menu.selected = false;
      });
    let menu = this.tabMenu.get(i);
    menu.selected = true;

    this.currViewMode = i;
    if (i == 0) this.gyodokMode = 0;
  }

  gyodokView(num:number) {
    this.rest.getGyodokContent(num)
      .then(rs => {
        // console.log(rs);
        this.gyodokMode = 2;
        this.gyodokItem = rs;
        this.gyodokContent = this.gyodokItem.CONTENT;
      })
      .catch(err => {
        console.log(err);
      })
  }

  gyodokPrev() {
    if (this.gyodokItem.ID - 1 <= 0) {
      this.util.showToast('교독문의 처음입니다.', 2000);
      return;
    } else {
      let num = this.gyodokItem.ID - 1;
      this.gyodokView(num);
    }
  }

  gyodokNext() {
    if (this.gyodokItem.ID + 1 > 213) {
      this.util.showToast('교독문의 끝입니다.', 2000);
      return;
    } else {
      let num = this.gyodokItem.ID + 1;
      this.gyodokView(num);
    }
  }

}
