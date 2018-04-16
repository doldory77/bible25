import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-gyodok',
  templateUrl: 'gyodok.html',
})
export class GyodokPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.tabMenu = new Map();
      this.tabMenu
        .set(0, {title:'교독문', selected: true})
        .set(1, {title:'주기도문', selected: false})
        .set(2, {title:'사도긴경', selected: false});
  }

  tabMenu: Map<number, {title:string, selected:boolean}>;
  currViewMode: number = 0;

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
  }

}
