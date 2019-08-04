import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
import { MdbTableDirective, MdbTablePaginationComponent } from "ng-uikit-pro-standard";

@Component({
	selector: "app-win-history",
	templateUrl: "./win-history.component.html",
	styleUrls: ["./win-history.component.scss"]
})
export class WinHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
	// DATATABLES PROPERTIES
	@ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
	@ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	elements: any = [];
	headElements = ["#", "Grupo", "Ganancias", "Fecha"];

	sortByElements = ["#", "groupInfo.initialInvertion", "earned", "createdAt"];

	previous: string;
	keyword = "de";

	maxVisibleItems = 15;

	// END DATATABLE PROPERTIES
	public existHistoryWin = true;

	ngUnsubscribe = new Subject<void>();
	public totalEarned = 0;
	public totalInvested = 0;
	public purchaseHistoryEarned: PurchaseHistory[] = [];

	public user: User;
	constructor(
		private logger: NGXLogger,
		private router: Router,
		private purchaseHistoryService: PurchaseService,
		private authService: AuthService,
		private spinner: NgxSpinnerService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.spinner.show();
		this.getPurchaseHistory();
	}

	ngAfterViewInit(): void {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
		this.cdRef.detectChanges();
	}

	getPurchaseHistory() {
		this.logger.info("GET PURCHASE HISTORY TOTAL EARNED");
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.purchaseHistoryService
			.getPurchaseHistoryByIdUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(historyPurchase => {
				this.purchaseHistoryEarned = Object.keys(historyPurchase).map(index => {
					return historyPurchase[index];
				});

				this.purchaseHistoryEarned = this.purchaseHistoryEarned.filter(h => h.action === ActionGameEnum.WIN).reverse();

				this.purchaseHistoryEarned.forEach((value, index) => {
					value.earned = Number(value.quantity["$numberDecimal"]);
				});

				if (this.purchaseHistoryEarned.length === 0) this.existHistoryWin = false;

				if (this.mdbTable) {
					this.mdbTable.setDataSource(this.purchaseHistoryEarned);
					this.purchaseHistoryEarned = this.mdbTable.getDataSource();
					this.previous = this.mdbTable.getDataSource();
				}

				this.spinner.hide();
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
