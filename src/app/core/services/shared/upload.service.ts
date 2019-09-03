import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Global } from "./global";
import { NGXLogger } from "ngx-logger";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class UploadService {
	public url: String;

	constructor(private logger: NGXLogger, private http: HttpClient) {
		this.url = Global.urlAuth;
	}

	upload(folder: string, id: string, file: File): Observable<any> {
		const uploadData = new FormData();
		uploadData.append("data", file, file.name);
		return this.http.put(this.url + "upload/" + folder + "/" + id, uploadData);
	}
}
