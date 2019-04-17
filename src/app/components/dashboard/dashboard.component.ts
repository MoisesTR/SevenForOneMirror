import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../enums/RoleEnum";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public groups: GroupGame[] = [];
	public users: User[] = [];
	public user: User;
	public userIsAdmin = false;

	elements: any = [];
	headElements = ["#", "Username", "First name", "Last name", "Email"];
	headElementsGroupsEarning = ["#", "Group", "Total invested", "Total winners"];

	constructor(private groupService: GroupService, private userService: UserService, private authService: AuthService) {}

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

	ngOnInit() {
		this.user = this.authService.getUser();
		this.userIsAdmin = this.user.role.name === RoleEnum.Admin;
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
	}
}
