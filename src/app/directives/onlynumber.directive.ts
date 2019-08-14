import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
	selector: "[appOnlyNumbers]"
})
export class NumberOnlyDirective {
	// Allow decimal numbers and negative values
	private regexDecimal: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
	private regexInt: RegExp = new RegExp(/^[0-9]*$/g);
	// Allow key codes for special events. Reflect :
	// Backspace, tab, end, home
	// private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
	private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home"];
	@Input() appOnlyNumbers: string;
	constructor(private el: ElementRef) {}

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent) {
		// Allow Backspace, tab, end, and home keys
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}

		const current: string = this.el.nativeElement.value;
		const next: string = current.concat(event.key);
		let regex;
		if (this.appOnlyNumbers === "decimal") {
			regex = this.regexDecimal;
		} else {
			regex = this.regexInt;
		}
		if (next && !String(next).match(regex)) {
			event.preventDefault();
		}
	}
}
