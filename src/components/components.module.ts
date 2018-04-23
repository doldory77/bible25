import { NgModule } from '@angular/core';
import { PlayerUiComponent } from './player-ui/player-ui';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [
		PlayerUiComponent,
    ],
	imports: [
		IonicModule
	],
	exports: [
		PlayerUiComponent,
	],
	entryComponents: [
		
	]
})
export class ComponentsModule {}
