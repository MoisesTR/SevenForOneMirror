import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from 'rxjs';
import {Global} from "./shared/global";

export abstract class RestService {

	protected baseUrl: string ;

	protected headers = new HttpHeaders({
		"Content-Type": "application/json"
	});

	protected constructor(public http: HttpClient) {
		this.baseUrl = Global.url;
	}

	protected get(relativeUrl: string): Observable<any> {
		return this.http.get(this.baseUrl + relativeUrl);
	}

	protected post(relativeUrl: string, data: any) {
		const params = JSON.stringify(data);
		return this.http.post(this.baseUrl + relativeUrl, params, { headers: this.headers });
	}
}
