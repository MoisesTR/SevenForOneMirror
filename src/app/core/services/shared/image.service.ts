import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
	providedIn: "root"
})
export class ImageService {
	constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}

	getImage(url: string): Observable<any> {
		return this.http
			.get(url, { responseType: "blob" })
			.map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e)));
	}
}
