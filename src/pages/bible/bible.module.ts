import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiblePage } from './bible';
import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [
    BiblePage,
  ],
  imports: [
    IonicPageModule.forChild(BiblePage),
    ComponentsModule
  ],
})
export class BiblePageModule {}
