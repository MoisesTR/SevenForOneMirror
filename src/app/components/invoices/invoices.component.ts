import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { User } from "../../models/User";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { Role } from "../../models/Role";
import { ActionGameEnum } from "../../enums/ActionGameEnum";
import { NgxSpinnerService } from "ngx-spinner";
import { MdbTableDirective, MdbTablePaginationComponent } from "ng-uikit-pro-standard";

@Component({
	selector: "app-invoices",
	templateUrl: "./invoices.component.html",
	styleUrls: ["./invoices.component.scss"]
})
export class InvoicesComponent implements OnInit, OnDestroy, AfterViewInit {
	// DATATABLES PROPERTIES
	@ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
	@ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	elements: any = [];
	headElements = ["#", "Grupo", "Fecha", "Método de Pago"];

	sortByElements = ["#", "invested", "createdAt", "paypal"];
	previous: string;
	keyword = "de";

	maxVisibleItems = 15;

	ngUnsubscribe = new Subject<void>();
	public purchaseHistoryInvested: PurchaseHistory[] = [];
	public user: User;
	public roles: Role[] = [];

	constructor(
		private router: Router,
		private authSevice: AuthService,
		private logger: NGXLogger,
		private purchaseHistoryService: PurchaseService,
		private spinner: NgxSpinnerService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.user = this.authSevice.getUser();
		this.logger.info("GET PURCHASE HISTORY INVESTED");
		this.getPurchaseHistory();
	}

	ngAfterViewInit(): void {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
		this.cdRef.detectChanges();
	}

	getPurchaseHistory() {
		this.spinner.show();
		this.purchaseHistoryService
			.getPurchaseHistoryByIdUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(historyPurchase => {
				this.purchaseHistoryInvested = Object.keys(historyPurchase).map(index => {
					return historyPurchase[index];
				});
				this.purchaseHistoryInvested = this.purchaseHistoryInvested
					.filter(h => h.action === ActionGameEnum.INVEST)
					.reverse();

				this.purchaseHistoryInvested.forEach((value, inde) => {
					value.invested = Number(value.quantity["$numberDecimal"]);
				});

				this.mdbTable.setDataSource(this.purchaseHistoryInvested);
				this.purchaseHistoryInvested = this.mdbTable.getDataSource();
				this.previous = this.mdbTable.getDataSource();

				this.spinner.hide();
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
