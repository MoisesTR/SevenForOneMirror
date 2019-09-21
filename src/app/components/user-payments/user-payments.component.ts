import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	AfterViewInit,
	ChangeDetectorRef,
	HostListener
} from "@angular/core";
import { MdbTableDirective, MdbTablePaginationComponent, ToastService } from "ng-uikit-pro-standard";
import { Winner } from "../../models/Winner";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { TopService } from "../../core/services/shared/top.service";
import { ModalService } from "../../core/services/shared/modal.service";
import { PaypalService } from "../../core/services/shared/paypal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: "app-user-payments",
	templateUrl: "./user-payments.component.html",
	styleUrls: ["./user-payments.component.scss"]
})
export class UserPaymentsComponent implements OnInit, AfterViewInit {
	// DATATABLES PROPERTIES
	@ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
	@ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	ngUnsubscribe = new Subject<void>();

	elements: any = [];
	headElements = ["#", "Usuario", "Nombres", "Correo de Pago", "Grupo", "Monto a pagar", "Fecha", "Estado", "Acción"];
	// sortByElements = ["#", "userName", "firstName", "paypalEmail", "email", "estado", "action"];

	previous: string;

	searchText = "";
	maxVisibleItems = 15;
	keyword = "de";

	optionsSelect: Array<any> = [];
	groupSelected: number;
	selectedValue = "1";
	existsWinners = false;
	public winners: Winner[] = [];
	public groups: GroupGame[] = [];

	constructor(
		private cdRef: ChangeDetectorRef,
		private groupService: GroupService,
		private topService: TopService,
		private paypalService: PaypalService,
		private modalService: ModalService,
		private spinnerService: NgxSpinnerService,
		private toastService: ToastService
	) {}

	@HostListener("input") oninput() {
		this.mdbTablePagination.searchText = this.searchText;

		this.searchElements();
	}

	searchElements() {
		const prev = this.mdbTable.getDataSource();

		if (!this.searchText) {
			this.mdbTable.setDataSource(this.previous);
			this.winners = this.mdbTable.getDataSource();
		}

		if (this.searchText) {
			this.winners = this.mdbTable.searchLocalDataBy(this.searchText);
			this.mdbTable.setDataSource(prev);
		}
	}

	ngOnInit() {
		this.getGroups();
	}

	ngAfterViewInit() {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
		this.cdRef.detectChanges();
	}

	getSelectedValue(value) {
		this.groupSelected = this.groups.find(group => group._id === value).initialInvertion;
		this.getTop10Winners(value);
	}

	getGroups() {
		this.groupService
			.getGroups()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(resp => {
				this.groups = resp;

				this.groups.forEach((group, index) => {
					if (index === 0) {
						this.getTop10Winners(group._id);
						this.selectedValue = group._id;
						this.groupSelected = group.initialInvertion;
						this.existsWinners = true;
					}
					this.optionsSelect = [...this.optionsSelect, { value: group._id, label: `$ ${group.initialInvertion}` }];
				});
			});
	}

	getTop10Winners(idGroup: string) {
		this.topService
			.getTop10WinnersByGroupId(idGroup)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((winners: Winner[]) => {
				this.winners = winners;

				this.winners.forEach((winner, index) => {
					winner.statusPayment = "SIN PAGAR";
				});

				this.mdbTable.setDataSource(this.winners);
				this.winners = this.mdbTable.getDataSource();
				this.previous = this.mdbTable.getDataSource();
			});
	}

	payToUser(winner: Winner) {
		if (!winner.paypalEmail) {
			this.modalService.showModalInfo("Este usuario no posee un correo de paypal asociado");
		} else {
			this.paypalService
				.payout(winner.totalWon["$numberDecimal"], winner.paypalEmail)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(resp => {
					const options = { toastClass: "opacity" };
					winner.statusPayment = "PAGADO";
					this.toastService.success(
						`El pago por la cantidad de $ ${winner.totalWon["$numberDecimal"]} se ha realizado correctamente`,
						"Pago",
						options
					);
				});
		}
	}
}
