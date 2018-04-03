import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BibleListPage } from './bible-list';

@NgModule({
  declarations: [
    BibleListPage,
  ],
  imports: [
    IonicPageModule.forChild(BibleListPage),
  ],
})
export class BibleListPageModule {}
