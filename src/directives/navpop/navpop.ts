import { Directive, HostListener } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the NavpopDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[cNavpop]' // Attribute selector
})
export class NavpopDirective {

  constructor(private app: App,
    private nativeAudio: NativeAudio,
    private platform: Platform) {
      
  }

  @HostListener('touchstart')
  public onTouch(e) {
    this.nativeAudio.play('click', () => {})
      // .then(() => console.log('랄랄라'))
      .catch(error => console.error("=== ERROR2: ", error));
    if (!this.platform.is('ios')) {
    }
    this.app.getRootNav().pop();
  }

}
