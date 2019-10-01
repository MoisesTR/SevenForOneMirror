import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";

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
