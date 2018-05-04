import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnPage } from './hymn';

@NgModule({
  declarations: [
    HymnPage,
  ],
  imports: [
    IonicPageModule.forChild(HymnPage),
  ],
})
export class HymnPageModule {}
