import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnBibleDetailPage } from './learn-bible-detail';

@NgModule({
  declarations: [
    LearnBibleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LearnBibleDetailPage),
  ],
})
export class LearnBibleDetailPageModule {}
