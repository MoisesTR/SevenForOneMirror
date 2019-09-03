import { Directive, Input } from "@angular/core";

@Directive({
	selector: "img[appDefaultImg]",
	host: {
		"(error)": "updateUrl()",
		"[src]": "src"
	}
})
export class ImagePreloadDirectiveDirective {
	@Input() src: string;
	@Input() appDefaultImg: string;
	constructor() {}

	updateUrl() {
		this.src = this.appDefaultImg;
	}
}
