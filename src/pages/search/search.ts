import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private indicator: LoadingController) {
      this.searchKeyWord = this.navParams.get("keyword");
      this.onSearchInput();
  }

  searchApiUrl = "http://ministrynote.com/bbs/search_bible25.php?sfl=wr_subject&sop=and&stx=#keyword";
  searchKeyWord: string = '';
  url: string;
  loading: Loading;

  onSearchInput() {
    // console.log("=========>", this.searchApiUrl.replace('#keyword', this.searchKeyWord));
    this.loading = this.indicator.create({
      showBackdrop: false,
      spinner: 'circles',
      cssClass: 'only-loading-icon', 
      dismissOnPageChange: true, 
    });
    this.loading.present();

    this.url = this.searchApiUrl.replace('#keyword', this.searchKeyWord);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  iframeLoaded() {
    try {
      let frm: any = document.getElementById('searchFrame');
      let frmDoc: any = frm.contentDocument || frm.contentWindow;
      frmDoc.getElementById('fixedBox').style.display = 'none';
    } catch (err) {
      console.log('fixedBox display hide error: ', err);
    }
    if (this.loading) this.loading.dismiss();
  }

}
