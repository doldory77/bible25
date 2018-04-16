import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GyodokPage } from './gyodok';

@NgModule({
  declarations: [
    GyodokPage,
  ],
  imports: [
    IonicPageModule.forChild(GyodokPage),
  ],
})
export class GyodokPageModule {}
