import { Component, OnDestroy, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { GameService } from "../../core/services/shared/game.service";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public groupsAdmin: Observable<GroupGame[]>;
	public groupsUser: GroupGame[] = [];
	public users: User[] = [];
	public user: User;
	public isUserAdmin = false;
	public group: GroupGame;
	public showWelcomeUser = true;

	elements: any = [];
	headElementsUsers = ["#", "Username", "First name", "Last name", "Email"];
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

	createContentDashboard(userIsAdmin) {
		if (!userIsAdmin) {
			this.getGroupsOfCurrentUser();
		} else {
			this.getGroupsAdmin();
			this.getUsersNormal();
		}
	}

	getGroupsAdmin() {
		this.groupsAdmin = this.groupService.getGroups();
	}

	getUsersNormal() {
		this.userService
			.getUsers()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(users => {
				this.users = users;
				this.users = this.userService.filterUsersByRol(users, RoleEnum.User);
			});
	}

	getGroupsOfCurrentUser() {
		this.groupService
			.getGroupsCurrentUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(response => {
				this.groupsUser = response;

				if (this.groupsUser.length > 0) this.showWelcomeUser = false;

				this.groupsUser.forEach(group => {
					group.circleUsers = this.gameService.generateCircles(group.members, group.lastWinner, this.user);
					group.circleUsersPlaying = this.gameService.getCircleUserPlaying(group.circleUsers);
					// group.circleUsersPlaying = group.circleUsersPlaying.reverse();
				});
			});
	}

	viewGroupUsers(groupId) {
		this.router.navigate(["/game", groupId]);
	}

	groupsDashboard() {
		this.router.navigate(["/groups"]);
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
