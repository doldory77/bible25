import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiblePage } from './bible';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BiblePage,
  ],
  imports: [
    IonicPageModule.forChild(BiblePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class BiblePageModule {}
