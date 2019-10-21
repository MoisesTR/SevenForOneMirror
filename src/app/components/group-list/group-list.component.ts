import { MdbTablePaginationComponent, MdbTableDirective } from "ng-uikit-pro-standard";
import {
	Component,
	OnInit,
	ViewChild,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	ElementRef,
	OnDestroy
} from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TableService } from "../../core/services/shared/table.service";
import { NgxSpinner } from "ngx-spinner/lib/ngx-spinner.enum";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalService } from "../../core/services/shared/modal.service";

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
	@ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	ngUnsubscribe = new Subject<void>();
	existsGroups = true;
	groups: GroupGame[] = [];
	elements: any = [];
	headElements = ["#", "Monto Grupo", "Acción"];
	sortByElements = ["", "initialInvertion", ""];
	keyword = "de";

	searchText = "";
	previous: string;

	maxVisibleItems = 15;

	constructor(
		private cdRef: ChangeDetectorRef,
		private groupService: GroupService,
		private tableService: TableService,
		private modalService: ModalService,
		private spinner: NgxSpinnerService
	) {}

	@HostListener("input") oninput() {
		this.mdbTablePagination.searchText = this.searchText;
	}

	ngOnInit() {
		this.spinner.show();
		this.getGroups();
	}

	ngAfterViewInit() {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);
		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
		this.cdRef.detectChanges();
	}

	searchItems() {
		this.groups = this.tableService.searchItems(this.groups, this.previous, this.searchText, this.mdbTable);
	}

	getGroups() {
		this.groupService
			.getGroups()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(groups => {
				this.groups = groups;

				if (groups.length === 0) this.existsGroups = false;

				this.mdbTable.setDataSource(this.groups);
				this.groups = this.mdbTable.getDataSource();
				this.previous = this.mdbTable.getDataSource();
				this.spinner.hide();
			});
	}

	disableGroup(group: GroupGame) {
		if (group.totalMembers > 0) {
			this.modalService.showModalInfo(
				`Este grupo tiene ${group.totalMembers} jugadores registrados, no se puede inactivar!`
			);
		} else {
			console.log("Inactivar miembros");
		}
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
