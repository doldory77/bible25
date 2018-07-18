import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BibleListPage } from './bible-list';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    BibleListPage,
  ],
  imports: [
    IonicPageModule.forChild(BibleListPage),
    DirectivesModule,
  ],
})
export class BibleListPageModule {}
