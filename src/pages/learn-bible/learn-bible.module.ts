import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnBiblePage } from './learn-bible';

@NgModule({
  declarations: [
    LearnBiblePage,
  ],
  imports: [
    IonicPageModule.forChild(LearnBiblePage),
  ],
})
export class LearnBiblePageModule {}
