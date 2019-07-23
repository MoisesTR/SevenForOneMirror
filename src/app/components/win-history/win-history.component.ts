import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { Router } from "@angular/router";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { Subject } from "rxjs";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { ActionGameEnum } from "../../enums/ActionGameEnum";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: "app-win-history",
	templateUrl: "./win-history.component.html",
	styleUrls: ["./win-history.component.scss"]
})
export class WinHistoryComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public totalEarned = 0;
	public totalInvested = 0;
	public purchaseHistoryEearned: PurchaseHistory[];

	public user: User;
	constructor(
		private logger: NGXLogger,
		private router: Router,
		private purchaseHistoryService: PurchaseService,
		private authService: AuthService,
		private spinner: NgxSpinnerService
	) {}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.spinner.show();
		this.getPurchaseHistory();
	}

	getPurchaseHistory() {
		this.logger.info("GET PURCHASE HISTORY TOTAL EARNED");
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.purchaseHistoryService
			.getPurchaseHistoryByIdUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(historyPurchase => {
				this.purchaseHistoryEearned = Object.keys(historyPurchase).map(index => {
					return historyPurchase[index];
				});
				this.purchaseHistoryEearned = this.purchaseHistoryEearned
					.filter(h => h.action === ActionGameEnum.WIN)
					.reverse();

				this.spinner.hide();
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
