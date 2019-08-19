import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class PaypalService {
	public url: string;

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	createPaypalTransaction(finalPrice: number): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ finalPrice });
		return this.http.post(this.url + "create-paypal-transaction", body, options);
	}
	payout(amountMoneyToPay: number): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ amountMoneyToPay: amountMoneyToPay });
		return this.http.post(this.url + "payout", body, options);
	}
}
