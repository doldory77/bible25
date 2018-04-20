import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GyodokPage } from './gyodok';
import { DirectivesModule } from '../../directives/directives.module'

@NgModule({
  declarations: [
    GyodokPage,
  ],
  imports: [
    IonicPageModule.forChild(GyodokPage),
    DirectivesModule
  ],
})
export class GyodokPageModule {}
