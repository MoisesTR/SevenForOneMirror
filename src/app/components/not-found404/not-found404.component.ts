import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-not-found404",
	templateUrl: "./not-found404.component.html",
	styleUrls: ["./not-found404.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFound404Component implements OnInit {
	constructor() {}

	ngOnInit() {}
}
