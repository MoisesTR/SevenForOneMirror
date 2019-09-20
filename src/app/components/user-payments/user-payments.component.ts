import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { MdbTableDirective, MdbTablePaginationComponent } from "ng-uikit-pro-standard";

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

	elements: any = [];
	headElements = ["#", "Usuario", "Nombres", "Correo de Pago", "Grupo", "Monto a pagar", "Fecha", "Estado", "Acción"];

	previous: string;

	maxVisibleItems = 15;

	optionsSelectStatus = [{ value: "1", label: "Pendiente" }, { value: "2", label: "Pagado" }];

	constructor(private cdRef: ChangeDetectorRef) {}

	ngOnInit() {
		for (let i = 1; i <= 15; i++) {
			this.elements.push({
				id: i.toString(),
				user: "UsuarioTest" + i,
				names: "Nombres " + i,
				email: "testemail@7x1.com",
				group: i.toString() + "0",
				earned: i.toString() + "00",
				date: "19/09/2019",
				status: "Pagado",
				buttons: ""
			});
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
}
