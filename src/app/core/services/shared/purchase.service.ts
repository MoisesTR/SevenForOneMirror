import { Injectable } from "@angular/core";
import { Global } from "./global";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class PurchaseService {
	public purchaseUrl = "purchase-history/";

	public url: string;
	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	getPurchaseHistory(): Observable<any> {
		return this.http.get(this.url + this.purchaseUrl + "me");
	}

	getPurchaseHistoryByIdUser(userId): Observable<any> {
		return this.http.get(this.url + this.purchaseUrl + userId);
	}
}
