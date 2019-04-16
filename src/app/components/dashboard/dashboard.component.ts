import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RolService } from "../../core/services/shared/rol.service";
import { Gender } from "../enums/Gender";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public groups: GroupGame[] = [];
	public users: User[] = [];
	public user: User;
	public idRolAdmin: string;

	// Chart
	public chartType = "line";
	public chartDatasets: Array<any> = [{ data: [200, 220], label: "$10" }, { data: [150, 50], label: "$50" }];

	public chartLabels: Array<any> = ["April", "May"];

	public chartColors: Array<any> = [
		{
			backgroundColor: "rgba(57, 126, 245, .2)",
			borderColor: "rgba(33, 111, 206, .7)",
			borderWidth: 2
		},
		{
			backgroundColor: "rgba(66, 213, 131, .2)",
			borderColor: "rgba(52, 191, 108, .7)",
			borderWidth: 2
		}
	];
	// End chart

	elements: any = [];
	headElements = ["#", "Username", "First name", "Last name", "Email"];
	headElementsGroupsEarning = ["#", "Group", "Total invested", "Total winners"];

	public chartOptions: any = {
		responsive: true
	};
	public chartClicked(e: any): void {}
	public chartHovered(e: any): void {}

	constructor(
		private groupService: GroupService,
		private userService: UserService,
		private authService: AuthService,
		private rolService: RolService
	) {}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
			console.log(this.groups);
		});

	}

	getUsers() {
		this.userService.getUsers().subscribe(users => {
			this.users = users;
			console.log(this.user);
		});
	}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.getGroups();
		this.getUsers();
		this.getRoles();

		for (let i = 1; i <= 15; i++) {
			this.elements.push({
				id: i,
				first: "User " + i,
				last: "Name " + i,
				handle: "Handle " + i
			});
		}
	}

	getRoles() {
		this.rolService.getRoles().subscribe(roles => {
			this.idRolAdmin = this.rolService.filterIdRol("Admin", roles);
		});
	}
}
