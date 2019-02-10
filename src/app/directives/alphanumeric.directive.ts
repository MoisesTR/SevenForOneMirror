import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[Alphanumeric]'
})
export class AlphanumericDirective {
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home'];

    constructor(private el: ElementRef) {}
    private regexAlphanumeric: RegExp = new RegExp(/^[a-zA-Z0-9\s]*$/g);

    @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): boolean {

        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(e.key);

        if (this.specialKeys.indexOf(e.key) !== -1) {
            return;
        }

        if ( next && !String(next).match(this.regexAlphanumeric)) {
            event.preventDefault();
        }
    }
}



