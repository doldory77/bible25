import { Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ContentDimensions } from 'ionic-angular/components/content/content';

interface OnScrollDetect {
    scrollDetector: ScrollDetectable;
    onScrollBottomDetect(content:Content);
    destroyScrollDetector(scrollDetector?: ScrollDetectable);
}

class ScrollDetectable {
    detectSubscription: Subscription;

    constructor() {
    }

    onScrollBottomDetect(content:Content, 
        interval:number, 
        successHandler:((data:{scrollTop:number, scrollHeight:number, contentTop:number, contentHeight:number}) => void), 
        errorHandler:((err:any) => void), 
        complete?:(() => void)) {

            this.detectSubscription = Observable.interval(interval)
                .map(() => {
                    let dim: ContentDimensions = content.getContentDimensions();
                    return {scrollTop:dim.scrollTop, scrollHeight:dim.scrollHeight, contentTop:dim.contentTop, contentHeight:dim.contentHeight}
                })
                .subscribe(successHandler, errorHandler, complete);
    }

    public destroy() {
        if (this.detectSubscription) {
            this.detectSubscription.unsubscribe();   
        }
    }

}

export { OnScrollDetect, ScrollDetectable }