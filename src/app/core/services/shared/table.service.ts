import { Injectable } from "@angular/core";
import { MdbTableDirective } from "ng-uikit-pro-standard";

@Injectable({
	providedIn: "root"
})
export class TableService {
	constructor() {}

	searchItems(elements: any[], previous: string, searchText: string, mdbTable: MdbTableDirective): any[] {
		const prev = mdbTable.getDataSource();

		if (!searchText) {
			mdbTable.setDataSource(previous);
			elements = mdbTable.getDataSource();
		}

		if (searchText) {
			elements = mdbTable.searchLocalDataBy(searchText);
			mdbTable.setDataSource(prev);
		}

		return elements;
	}
}
