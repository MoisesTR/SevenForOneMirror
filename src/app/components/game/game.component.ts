import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { MemberGroup } from "../../models/MemberGroup";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
	@Input()
	members: MemberGroup[] = [];

	@Input()
	groupSeleccionado: GroupGame;

	@Input()
	public userActual: User;

	@Input()
	isUserAdmin = false;

	constructor() {}

	ngOnInit() {}
}
