import {Directive, ElementRef, HostListener,Input} from '@angular/core';

@Directive({
    selector: '[NegOrPosNumber]'
})
export class NegOrPosNumbergDirective {

    @Input('NegOrPosNumber') recibir:boolean;
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];

    private regexAcceptDecimalNumber: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    private regexAcceOnlyNumber: RegExp = new RegExp(/^[0-9]*$/g);
    
    constructor(private _el: ElementRef) { }

    @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): boolean {

        const current: string = this._el.nativeElement.value;
        const next: string = current.concat(e.key);

        if (this.specialKeys.indexOf(e.key) !== -1) {
            return;
        }

        if(this.recibir===true){
            if ( next && !String(next).match(this.regexAcceOnlyNumber)) {
                event.preventDefault();
            }
        }else{
            if ( next && !String(next).match(this.regexAcceptDecimalNumber)) {
                event.preventDefault();
            }
        }
    }
}
