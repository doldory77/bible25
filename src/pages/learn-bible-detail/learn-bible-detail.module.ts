import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnBibleDetailPage } from './learn-bible-detail';
import { DirectivesModule } from '../../directives/directives.module'
import { PlayerUiComponent } from '../../components/player-ui/player-ui';

@NgModule({
  declarations: [
    LearnBibleDetailPage,
    PlayerUiComponent
  ],
  imports: [
    IonicPageModule.forChild(LearnBibleDetailPage),
    DirectivesModule
  ],
  entryComponents: [
    PlayerUiComponent
  ]
})
export class LearnBibleDetailPageModule {}
