import { NgModule } from '@angular/core';
import { PinchDirective } from './pinch/pinch';
import { NavpopDirective } from './navpop/navpop';
@NgModule({
	declarations: [
		PinchDirective,
		NavpopDirective
	],
	imports: [],
	exports: [
		PinchDirective,
		NavpopDirective
	]
})
export class DirectivesModule {}
