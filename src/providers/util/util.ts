import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UtilProvider {

  constructor(private toast: ToastController) {
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

  getBibleType(book:number): number {
    if (book <= 39) {
      return 0
    } else {
      return 1
    }
  }

}
