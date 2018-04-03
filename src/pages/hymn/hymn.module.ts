import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnPage } from './hymn';
import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [
    HymnPage,
  ],
  imports: [
    IonicPageModule.forChild(HymnPage),
    ComponentsModule
  ],
})
export class HymnPageModule {}
