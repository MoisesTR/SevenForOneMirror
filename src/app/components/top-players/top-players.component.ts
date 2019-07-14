import { Component, Input, OnInit } from "@angular/core";
import { GroupGame } from "src/app/models/GroupGame";
import { Winner } from "../../models/Winner";

@Component({
	selector: "app-top-players",
	templateUrl: "./top-players.component.html",
	styleUrls: ["./top-players.component.scss"]
})
export class TopPlayersComponent implements OnInit {
	@Input()
	winners3: Winner[] = [];

	@Input()
	winners7: Winner[] = [];

	@Input()
	group: GroupGame;

	@Input()
	title = "Monto";

	@Input()
	renderMount = true;

	constructor() {}

	ngOnInit() {}
}
