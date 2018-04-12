import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.tabMenu = new Map();
      this.tabMenu
        .set(0, {title:'즐겨찾기', selected:true})
        .set(1, {title:'성경읽기', selected:false})
        .set(2, {title:'개인정보수정', selected:false});
  }

  tabMenu: Map<number, {title:string, selected:boolean}>;
  currViewMode:number = 0;
  isBibleShow: boolean = true;
  isHymnShow: boolean = true;

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPage');
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

  removeBookMark(item:number) {
    console.log('TODO DB에서 북마크 삭제');
  }

}
