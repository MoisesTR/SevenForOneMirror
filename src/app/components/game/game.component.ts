import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { MemberGroup } from "../../models/MemberGroup";
import { CircleUser } from "../../models/CircleUser";
import { CircleStatusEnum } from "../../enums/CircleStatusEnum";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
	@Input()
	groupSeleccionado: GroupGame;

	@Input()
	userActual: User;

	@Input()
	isUserAdmin = false;

	@Input()
	circleUsers: CircleUser[] = [];

	constructor() {}

	ngOnInit() {}
}
