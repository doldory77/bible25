import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { UtilProvider } from '../../providers/util/util';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private globalVars: GlobalVarsProvider,
    private util: UtilProvider) {
  }

  fontSize: number = 1.0;
  fontColor: string = "#000000";
  displayFont: string = "10";
  backgroundColor: string= "#FFFFFF";
  pushYn: boolean = true;

  ionViewDidLoad() {

    this.globalVars.getValueWithStorage('fontSize')
      .then(value => {
        console.log(value);
        this.fontSize = value;
        this.displayFont = Math.floor(this.fontSize * 10) + "";
      }, error => {console.error(error)});

    this.globalVars.getValueWithStorage('backgroundColor')
      .then(value => {
        this.backgroundColor = value;
      }, error => {console.error(error)});

    this.globalVars.getValueWithStorage('fontColor')
      .then(value => {
        this.fontColor = value;
      }, error => {console.error(error)});

    this.globalVars.getValueWithStorage('pushYn')
      .then(value => {
        this.pushYn = value;
      }, error => {console.error(error)});

    // this.globalVars.getValueWithStorage('fontSize')
    //   .then(value => {
    //     console.log(value);
    //     if (!value) {
    //       this.fontSize = 1.0;
    //       this.displayFont = Math.floor(this.fontSize * 10) + "";
    //     } else {
    //       this.fontSize = value;
    //       this.displayFont = Math.floor(this.fontSize * 10) + "";
    //     }
    //   }, error => {console.error(error)});

    // this.globalVars.getValueWithStorage('backgroundColor')
    //   .then(value => {
    //     if (!value) {
    //       this.backgroundColor = '#FFFFFF';
    //     } else {
    //       this.backgroundColor = value;
    //     }
    //   }, error => {console.error(error)});

    // this.globalVars.getValueWithStorage('fontColor')
    //   .then(value => {
    //     if (!value) {
    //       this.fontColor = '#000000';
    //     } else {
    //       this.fontColor = value;
    //     }
    //   }, error => {console.error(error)});

    // this.globalVars.getValueWithStorage('pushYn')
    //   .then(value => {
    //     if (value == null || value == undefined) {
    //       this.pushYn = true;
    //     } else {
    //       this.pushYn = value;
    //     }
    //   }, error => {console.error(error)});

  }

  ionViewWillEnter() {

  }

  ionViewWillLeave() {
    this.globalVars.addValueWithStorage('pushYn', this.pushYn);
  }

  increaseFont() {
    if (this.fontSize < 2.0) {
      this.fontSize = Number((this.fontSize + 0.1).toFixed(1));
      this.globalVars.addValueWithStorage('fontSize', this.fontSize);
    } else {
      this.util.showToast('폰트의 최대 크기는 20입니다.', 3000);
    }
    this.displayFont = Math.floor(this.fontSize * 10) + "";
  }

  decreaseFont() {
    if (this.fontSize > 1.0) {
      this.fontSize = Number((this.fontSize - 0.1).toFixed(1));
      this.globalVars.addValueWithStorage('fontSize', this.fontSize);
    } else {
      this.util.showToast('폰트의 최소 크기는 10입니다.', 3000);
    }
    this.displayFont = Math.floor(this.fontSize * 10) + "";
  }

  changeColor(backColor: string, fontColor: string) {
    this.backgroundColor = backColor;
    this.fontColor = fontColor;
    this.globalVars.addValueWithStorage('backgroundColor', backColor);
    this.globalVars.addValueWithStorage('fontColor', fontColor);
  }

}
