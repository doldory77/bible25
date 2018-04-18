import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnBibleDetailPage } from './learn-bible-detail';
import { DirectivesModule } from '../../directives/directives.module'

@NgModule({
  declarations: [
    LearnBibleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LearnBibleDetailPage),
    DirectivesModule
  ],
})
export class LearnBibleDetailPageModule {}
