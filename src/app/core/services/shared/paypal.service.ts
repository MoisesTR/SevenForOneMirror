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

	createPaypalTransaction(finalPrice: number, groupId: string): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ finalPrice, groupId });
		return this.http.post(this.url + "create-paypal-transaction", body, options);
	}

	authorizeTransaction(orderID: string) {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ orderID });

		return this.http.post(this.url + "authorize-paypal-transaction", body, options);
	}

	capturePaypalTransaction(orderID: string): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ orderID });
		return this.http.post(this.url + "capture-transaction", body, options);
	}

	payout(amountMoneyToPay: number, paypalEmail: string): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ amountMoneyToPay, paypalEmail });
		return this.http.post(this.url + "payout", body, options);
	}
}
