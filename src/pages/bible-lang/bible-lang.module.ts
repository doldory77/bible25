import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BibleLangPage } from './bible-lang';

@NgModule({
  declarations: [
    BibleLangPage,
  ],
  imports: [
    IonicPageModule.forChild(BibleLangPage),
  ],
})
export class BibleLangPageModule {}
