import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class UtilProvider {

  constructor(private toast: ToastController,
    private alert: AlertController,
    private loading: LoadingController) {

  }

  showToast(message:string, duration:number) {
    this.toast.create({
      message:message,
      duration:duration
    }).present();
  }

  public pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  getToday(): string {
    let today = new Date();
    return today.getFullYear() + '' 
      + this.pad((today.getMonth()+1), 2) + '' 
      + this.pad(today.getDate(), 2) + '' 
      + this.pad(today.getHours(), 2) + '' 
      + this.pad(today.getMinutes(), 2) + '' 
      + this.pad(today.getSeconds(), 2)
  }

  getYYYYMMDD(): string {
    let today = new Date();
    return today.getFullYear() + '-' 
      + this.pad(today.getMonth() + 1, 2) + '-'
      + this.pad(today.getDate(), 2);
  }

  getNextMonthYYYYMMDD(): string {
    let today = new Date();
    return today.getFullYear() + '-' 
      + this.pad(today.getMonth() + 2, 2) + '-'
      + this.pad(today.getDate(), 2);
  }

  getBibleType(book:number): number {
    if (book <= 39) {
      return 0
    } else {
      return 1
    }
  }

  showConformAlert(title:string, message:string, okHandler:(() => void)) {
    this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: '취소',
          handler: () => {}
        },
        {
          text: '확인',
          handler: okHandler
        }
      ]
    }).present();
  }

  showAlert(title:string, message:string) {
    this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: '확인'
        }
      ]
    }).present()
  }

  showSimpleLoading(duration?:number, spinner?:string): Loading {
    let _spinner: string = 'circles';
    let _duration: number = 5000;
    if (spinner) {
      _spinner = spinner;
    }
    if (duration) {
      _duration = duration;
    }
    
    let indicator = this.loading.create({
        showBackdrop: false,
        spinner: _spinner,
        cssClass: 'only-loading-icon', 
        dismissOnPageChange: true,
        duration: _duration
    });

    indicator.present();
    return indicator;
  }

  isDefaultNumber(src: number, defaultValue: number): number {
    if (!src || src < 0) {
      return defaultValue;
    } else {
      return src;
    }
  }

  isEmptyNumber(src: number) {
    if (!src || src <= 0 ) {
      return true
    }
    return false;
  }

}
