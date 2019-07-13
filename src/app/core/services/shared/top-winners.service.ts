import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Global} from './global';
import {Observable} from 'rxjs';
@Injectable({
	providedIn: "root"
})
export class TopWinnersService {
	public topUrl = "winners/top";

	public url: string;
	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	getTop10ByGroupId(groupId: string, limit: number): Observable<any> {
		return this.http.get(this.url + this.topUrl + "/" + limit + "/" + groupId);
	}

	getGlobalTop10(): Observable<any> {
		return this.http.get(this.url + this.topUrl);
	}

}
