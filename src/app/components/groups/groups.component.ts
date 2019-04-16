import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../enums/RoleEnum";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit {
	public groups: GroupGame[] = [];
	public user: User;
	constructor(private groupService: GroupService, private authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.getGroups();
		this.user = this.authService.getUser();
	}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
		});
	}

	goButton(index, groupId) {
		if (this.user.role.name === RoleEnum.User) {
			swal
				.fire({
					title: "Confirmation",
					text: "Do you want to come in?",
					type: "info",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Yes, i do!"
				})
				.then(result => {
					if (result.value) {
						this.addMemberToGroup(groupId);
					}
				});
		} else {
			this.router.navigate(["/game", groupId]);
		}
	}

	addMemberToGroup(groupId) {
		const member = new MemberGroup();
		member.payReference = "payreferenceuser";
		this.groupService.addMemberToGroup(member, groupId).subscribe(response => {
			swal.fire("Info", "The registration has been successful!", "success").then(() => {
				this.router.navigate(["/game", groupId]);
			});
		});
	}
}
