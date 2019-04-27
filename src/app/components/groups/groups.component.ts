import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit {
	public groups: GroupGame[] = [];
	public user: User;
	public userIsAdmin = false;
	constructor(
		private groupService: GroupService,
		private authService: AuthService,
		private purchaseService: PurchaseService,
		private updateMoneyService: UpdateMoneyService,
		private router: Router
	) {}

	ngOnInit() {
		this.getGroups();
		this.user = this.authService.getUser();
		this.userIsAdmin = this.user.role.name === RoleEnum.Admin;
	}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
		});
	}

	// esta validacion esta por mientras , por que el usuario puede ser sacado desde la base por otros usuarios, y ya no tendria lugar la validacion, consultar oportunamente a la base mejor
	goButtonUser(groupId) {
    this.actionGroup(false, groupId);
		// this.validateMemberIsNotAlreadyRegistered(groupId);
	}

	validateMemberIsNotAlreadyRegistered(groupId) {
		this.groupService.getGroup(groupId).subscribe(group => {
			const userIsAlreadyInGroup = this.groupService.filterMemberByGroup(group, this.user._id);
			this.actionGroup(userIsAlreadyInGroup, groupId);
		});
	}

	actionGroup(already, groupId) {
		if (this.userIsAdmin) {
			this.router.navigate(["/game", groupId]);
		} else {
			if (already) {
				this.router.navigate(["/game", groupId]);
			} else {
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
			}
		}
	}

	addMemberToGroup(groupId) {
		const member = new MemberGroup();
		member.payReference = "payreferenceuser";
		this.groupService.addMemberToGroup(member, groupId).subscribe(() => {
			swal.fire("Info", "The registration has been successful!", "success").then(() => {
				this.updateMoneyService.update(true);
				this.router.navigate(["/game", groupId]);
			});
		});
	}
}
