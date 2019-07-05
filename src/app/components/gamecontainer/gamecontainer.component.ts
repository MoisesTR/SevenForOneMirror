import { Component, OnInit } from "@angular/core";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { AuthService } from "../../core/services/auth/auth.service";
import { ActivatedRoute, Params } from "@angular/router";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { GameService } from "../../core/services/shared/game.service";
import { CircleUser } from "../../models/CircleUser";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";

@Component({
	selector: "app-gamecontainer",
	templateUrl: "./gamecontainer.component.html",
	styleUrls: ["./gamecontainer.component.scss"]
})
export class GamecontainerComponent implements OnInit {
	public group: GroupGame;
	public groupSeleccionado: GroupGame;
	public members: MemberGroup[] = [];
	public userActual: User;
	public idGroup: number;
	public isUserAdmin = false;
	public circleUsers: CircleUser[] = [];
	public circleUserPlaying: CircleUser[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private groupService: GroupService,
		private authService: AuthService,
		private gameService: GameService,
		private socketGroupGame: SocketGroupGameService
	) {}

	ngOnInit() {
		this.initSocketGroupGame();
		this.getUser();
		this.getParams();
	}

	initSocketGroupGame() {}

	getParams() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.idGroup = params["idGroup"];

			if (this.idGroup) {
				this.getMembersGroup(this.idGroup);
			}
		});
	}

	getUser() {
		this.userActual = this.authService.getUser();
		this.isUserAdmin = this.userActual.role.name === RoleEnum.Admin;
	}

	getMembersGroup(idGroup) {
		this.groupService.getGroup(idGroup).subscribe(group => {
			this.groupSeleccionado = group;

			this.initSocketGroupActivity(group);

			this.members = this.groupSeleccionado.members;
			this.circleUsers = this.gameService.generateCircles(
				this.members,
				this.groupSeleccionado.lastWinner,
				this.userActual
			);
			this.circleUserPlaying = this.gameService.getCircleUserPlaying(this.circleUsers);
			// this.circleUserPlaying = this.circleUserPlaying.reverse();
		});
	}

	initSocketGroupActivity(group: GroupGame) {
		console.log(EventEnum.GROUP_ACTIVITY + group.initialInvertion);
		this.socketGroupGame.onEventGroup(EventEnum.GROUP_ACTIVITY + group.initialInvertion).subscribe(member => {
			console.log("Actividad grupo: " + this.idGroup);
			console.log(member);
		});
	}
}
