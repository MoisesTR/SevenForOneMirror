import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { User } from "../../models/User";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { Role } from "../../models/Role";

@Component({
	selector: "app-invoices",
	templateUrl: "./invoices.component.html",
	styleUrls: ["./invoices.component.scss"]
})
export class InvoicesComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public purchaseHistoryInvested: PurchaseHistory[] = [];
	public user: User;
	public roles: Role[] = [];

	constructor(
		private router: Router,
		private authSevice: AuthService,
		private logger: NGXLogger,
		private purchaseHistoryService: PurchaseService
	) {}

	ngOnInit() {
		this.user = this.authSevice.getUser();

		this.logger.info("GET PURCHASE HISTORY INVESTED");
		this.getPurchaseHistory();
	}

	getPurchaseHistory() {
		this.purchaseHistoryService
			.getPurchaseHistoryByIdUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(historyPurchase => {
				this.purchaseHistoryInvested = Object.keys(historyPurchase).map(index => {
					return historyPurchase[index];
				});
				this.purchaseHistoryInvested = this.purchaseHistoryInvested.filter(h => h.moneyDirection);
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
