import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[AcceptCharacters]'
})
export class AcceptCharactersDirective {
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];

    constructor(private el: ElementRef) {}
    private regexAcceptCharacters: RegExp = new RegExp(/^[a-zA-Z0-9\-\_\#\&\*]*$/g);

    @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): boolean {

        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(e.key);

        if (this.specialKeys.indexOf(e.key) !== -1) {
            return;
        }

        if ( next && !String(next).match(this.regexAcceptCharacters)) {
            event.preventDefault();
        }
    }
}



