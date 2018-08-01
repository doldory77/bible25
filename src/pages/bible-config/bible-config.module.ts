import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BibleConfigPage } from './bible-config';

@NgModule({
  declarations: [
    BibleConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(BibleConfigPage),
  ],
})
export class BibleConfigPageModule {}
