import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnDetailPage } from './hymn-detail';

@NgModule({
  declarations: [
    HymnDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HymnDetailPage),
  ],
})
export class HymnDetailPageModule {}
