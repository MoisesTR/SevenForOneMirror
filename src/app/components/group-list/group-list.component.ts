import { MdbTablePaginationComponent, MdbTableDirective } from "ng-uikit-pro-standard";
import {
	Component,
	OnInit,
	ViewChild,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	ElementRef
} from "@angular/core";

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent implements OnInit, AfterViewInit {
	@ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
	@ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	elements: any = [];
	headElements = ["#", "Monto Grupo", "Acción"];

	searchText = "";
	previous: string;

	maxVisibleItems = 15;

	constructor(private cdRef: ChangeDetectorRef) {}

	@HostListener("input") oninput() {
		this.mdbTablePagination.searchText = this.searchText;
	}

	ngOnInit() {
		for (let i = 1; i <= 25; i++) {
			this.elements.push({ id: i.toString(), montoGrupo: i.toString() + "0" });
		}

		this.mdbTable.setDataSource(this.elements);
		this.elements = this.mdbTable.getDataSource();
		this.previous = this.mdbTable.getDataSource();
	}

	ngAfterViewInit() {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
		this.cdRef.detectChanges();
	}

	searchItems() {
		const prev = this.mdbTable.getDataSource();

		if (!this.searchText) {
			this.mdbTable.setDataSource(this.previous);
			this.elements = this.mdbTable.getDataSource();
		}

		if (this.searchText) {
			this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
			this.mdbTable.setDataSource(prev);
		}

		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();

		this.mdbTable.searchDataObservable(this.searchText).subscribe(() => {
			this.mdbTablePagination.calculateFirstItemIndex();
			this.mdbTablePagination.calculateLastItemIndex();
		});
	}
}
