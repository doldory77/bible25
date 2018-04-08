import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'hymn-search-type',
  template: `
    <ion-list radio-group [(ngModel)]="searchType">
      <ion-item>
        <ion-label>제목</ion-label>
        <ion-radio value="0" [checked]="searchType == '0'" (ionSelect)="radioChecked('0')"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>가사</ion-label>
        <ion-radio value="1" [checked]="searchType == '1'" (ionSelect)="radioChecked('1')"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>장</ion-label>
        <ion-radio value="2" [checked]="searchType == '2'" (ionSelect)="radioChecked('2')"></ion-radio>
      </ion-item>
    </ion-list>
  `,
  styles: []
})
export class HymnSearchTypeComponent {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    // console.log(this.navParams.get('searchType'));
    this.searchType = this.navParams.get('searchType');
  }

  searchTypes = new Map<string,any>()
    .set('0', {code:'0', name:'전체'})
    .set('1', {code:'1', name:'가사'})
    .set('2', {code:'2', name:'장'});

  searchType: string = "0";

  close(outParams:{code:string, name:string})  {
    this.viewCtrl.dismiss(outParams);
  }

  radioChecked(value:string) {
    // console.log('searchType ==> ', this.searchType);
    // console.log('value ===> ', value);
    this.close(this.searchTypes.get(value));
  }  

  

}
