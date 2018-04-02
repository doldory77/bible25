import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiblePage } from './bible';
// import { LongPressModule } from 'ionic-long-press';

@NgModule({
  declarations: [
    BiblePage,
  ],
  imports: [
    IonicPageModule.forChild(BiblePage),
    // LongPressModule
  ],
})
export class BiblePageModule {}
