import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { MemberGroup } from "../../models/MemberGroup";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public groups: GroupGame[] = [];
	public users: User[] = [];
	public user: User;
	public isUserAdmin = false;
	public group: GroupGame;
	public groupSeleccionado: GroupGame;
	public members: MemberGroup[] = [];
	public userActual: User;
	public array: number[] = [];

	elements: any = [];
	headElements = ["#", "Username", "First name", "Last name", "Email"];
	headElementsGroupsEarning = ["#", "Group", "Total invested", "Total winners"];

	constructor(private groupService: GroupService, private userService: UserService, private authService: AuthService) {}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.isUserAdmin = this.user.role.name === RoleEnum.Admin;
		this.createContentDashboard(this.isUserAdmin);
	}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
		});
	}

	getUsersNormal() {
		this.userService.getUsers().subscribe(users => {
			this.users = users;
			this.users = this.userService.filterUsersByRol(users, RoleEnum.User);
		});
	}

	createContentDashboard(userIsAdmin) {
		if (userIsAdmin) {
			this.getGroups();
			this.getUsersNormal();
			for (let i = 1; i <= 15; i++) {
				this.elements.push({
					id: i,
					first: "User " + i,
					last: "Name " + i,
					handle: "Handle " + i
				});
			}
		} else {
			// SIMULANDO GRUPO DONDE ESTA INSCRITO EL USUARIO
			this.getGroups();

			// TEMPORAL COLOCAR UN ID ESTATICO DE UN GRUPO DE JUEGO REGISTRADO
			this.getMembersGroup("5cc2a4638963ca1eb0a76b42");
		}
	}

	getMembersGroup(idGroup) {
		this.groupService.getGroup(idGroup).subscribe(group => {
			this.groupSeleccionado = group;
			this.members = this.groupSeleccionado.members;
		});
	}
}
