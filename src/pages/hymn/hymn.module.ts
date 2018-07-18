import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnPage } from './hymn';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    HymnPage,
  ],
  imports: [
    IonicPageModule.forChild(HymnPage),
    DirectivesModule,
  ],
})
export class HymnPageModule {}
