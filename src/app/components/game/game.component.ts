import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { ActivatedRoute, Params } from "@angular/router";
import { MemberGroup } from "../../models/MemberGroup";
import {RoleEnum} from '../enums/RoleEnum';

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
	public group: GroupGame;
	public groupSeleccionado: GroupGame;
	public members: MemberGroup[] = [];
	public totalMount: number;
	public montoInvertir: number;
	public userActual: User;
	public idGroup: number;
	public limitePersonas = 7;
	public isUserAdmin = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private groupService: GroupService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.getUser();
		this.getParams();
	}

	getParams() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.idGroup = params["idGroup"];

			this.getMembersGroup(this.idGroup);
			this.getGroup(this.idGroup);
		});
	}

	getUser() {
		this.userActual = this.authService.getUser();
		this.isUserAdmin = this.userActual.role.name === RoleEnum.Admin;
	}

	getMembersGroup(idGroup) {
		this.groupService.getGroup(idGroup).subscribe(group => {
			this.group = group;
			this.members = this.group.members;
		});
	}

	getGroup(groupId) {
		this.groupService.getGroup(groupId).subscribe(group => {
			this.groupSeleccionado = group;
		});
	}

}
