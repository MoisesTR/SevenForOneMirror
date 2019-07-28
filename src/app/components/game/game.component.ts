import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { MemberGroup } from "../../models/MemberGroup";
import { CircleUser } from "../../models/CircleUser";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
	@Input()
	groupSelected: GroupGame;

	@Input()
	actualUser: User;

	@Input()
	isUserAdmin = false;

	@Input()
	circleUsers: CircleUser[] = [];

	@Input()
	circleUsersPlaying: CircleUser[] = [];

	@Input()
	members: MemberGroup[] = [];

	@Input()
	iterationValue = 1;

	constructor() {}

	ngOnInit() {}

	delay(i: number) {
		if (this.iterationValue === 0) {
			return "0s";
			// return (( 10  - (i + 1)) / 10).toString() + 's';
		} else {
			return ((10 - (i + 1)) / 10).toString() + "s";
		}
	}
}
