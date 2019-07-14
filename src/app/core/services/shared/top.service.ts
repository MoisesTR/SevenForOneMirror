import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Global} from "./global";
import {Observable} from "rxjs";

@Injectable({
	providedIn: "root"
})
export class TopService {
	public topUrl = "winners/top";

	public url: string;
	public modalEventTopWinners = new EventEmitter<any>();
	public modalEventLastWinners = new EventEmitter<any>();

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	showModalTopWinners() {
		this.modalEventTopWinners.emit(true);
	}

  showModalTopLastWinners() {
    this.modalEventLastWinners.emit(true);
  }

	getTop10WinnersByGroupId(groupId: string, limit = 10): Observable<any> {
		return this.http.get(this.url + this.topUrl + "/" + limit + "/" + groupId);
	}

  getTop10ConcurrentWinners(groupId?: string, limit = 10): Observable<any> {
    return this.http.get(this.url + this.topUrl + "/" + limit + "/" + groupId + "?times=true");
  }

	getTop10WinnersByMount(limit = 10): Observable<any> {
		return this.http.get(this.url + this.topUrl + "/" + limit);
	}

	getGlobalTop10(): Observable<any> {
		return this.http.get(this.url + this.topUrl);
	}
}
