import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BibleConfigPage } from './bible-config';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    BibleConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(BibleConfigPage),
    DirectivesModule
  ],
})
export class BibleConfigPageModule {}
