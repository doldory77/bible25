import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnBiblePage } from './learn-bible';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    LearnBiblePage,
  ],
  imports: [
    IonicPageModule.forChild(LearnBiblePage),
    DirectivesModule,
  ]
})
export class LearnBiblePageModule {}
