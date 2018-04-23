import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HymnDetailPage } from './hymn-detail';
import { DirectivesModule } from '../../directives/directives.module'
import { PlayerUiComponent } from '../../components/player-ui/player-ui';

@NgModule({
  declarations: [
    HymnDetailPage,
    PlayerUiComponent
  ],
  imports: [
    IonicPageModule.forChild(HymnDetailPage),
    DirectivesModule
  ],
  entryComponents: [
    PlayerUiComponent
  ]
})
export class HymnDetailPageModule {}
