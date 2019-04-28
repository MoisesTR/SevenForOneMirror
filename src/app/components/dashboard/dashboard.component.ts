import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { MemberGroup } from "../../models/MemberGroup";
import { GameService } from "../../core/services/shared/game.service";
import { IndividualGroup } from "../../models/IndividualGroup";
import { Router } from "@angular/router";

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
	public showWelcomeUser = true;

	elements: any = [];
	headElements = ["#", "Username", "First name", "Last name", "Email"];
	headElementsGroupsEarning = ["#", "Group", "Total invested", "Total winners"];

	constructor(
		private groupService: GroupService,
		private userService: UserService,
		private gameService: GameService,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.isUserAdmin = this.user.role.name === RoleEnum.Admin;
		this.createContentDashboard(this.isUserAdmin);
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
			this.getGroupsCurrentUser();
		}
	}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
		});
	}

	getGroupsCurrentUser() {
		this.groupService.getGroupsCurrentUser(this.user._id).subscribe(response => {
			this.groups = response;

			if (this.groups.length > 0) this.showWelcomeUser = false;

			this.groups.forEach((group, index) => {
				group.circleUsers = this.gameService.generateCirclesUser(group.members, group.lastWinner, this.user);
				group.circleUsersPlaying = this.gameService.getCircleUserPlaying(group.circleUsers);
				// group.circleUsersPlaying = group.circleUsersPlaying.reverse();
			});
		});
	}

	viewGroupUsers(groupId) {
		this.router.navigate(["/game", groupId]);
	}
}
