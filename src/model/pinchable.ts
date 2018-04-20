export class Pinchable {
    
    static MAX_SCALE = 2.1;
    // static MIN_SCALE = 0.9;
    static MIN_SCALE = 1.1;
    static BASE_SCALE = 1.5;

    public fontSize = `${Pinchable.BASE_SCALE}rem`;
    public scale = Pinchable.BASE_SCALE;
    public alreadyScaled = Pinchable.BASE_SCALE;
    public isScaling = false;

    public onPinchStart(e) {

        // flag that sets the class to disable scrolling
        console.log('onPinchStart')
        this.isScaling = true;
      }
    
      // called at (pinchend) and (pinchcancel)
      public onPinchEnd(e) {
    
        // flip the flag, enable scrolling
        this.isScaling = false;
    
        // adjust the amount we already scaled
        this.alreadyScaled = this.scale * this.alreadyScaled;
        console.log('onPinchEnd')
      }
    
      public onPinchMove(e) {
    
        // set the scale so we can track it globally
        this.scale = e.scale;
    
        // total amount we scaled
        let totalScaled = this.alreadyScaled * e.scale;
    
        // did we hit the max scale (pinch out)
        if (totalScaled >= Pinchable.MAX_SCALE) {
    
          // fix the scale by calculating it, don't use the e.scale
          // scenario: an insane quick pinch out will offset the this.scale
          this.scale = Pinchable.MAX_SCALE / this.alreadyScaled;
          totalScaled = Pinchable.MAX_SCALE;
    
          // did we hit the min scale (pinch in)
        } else if (totalScaled <= Pinchable.MIN_SCALE) {
    
          // fix the scale
          this.scale = Pinchable.MIN_SCALE / this.alreadyScaled;
          totalScaled = Pinchable.MIN_SCALE;
    
        }
    
        let fontSize = Math.round(totalScaled * 10) / 10;
    
        // change the fontsize every 3 decimals in scale change
        if ((fontSize * 10) % 3 === 0) {
    
          // update the fontsize
          this.fontSize = `${fontSize}rem`;
        }
    
      }
}