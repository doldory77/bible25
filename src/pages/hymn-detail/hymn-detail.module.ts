import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnDetailPage } from './hymn-detail';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HymnDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HymnDetailPage),
    DirectivesModule,
    ComponentsModule
  ],
  entryComponents: [
  ]
})
export class HymnDetailPageModule {}
