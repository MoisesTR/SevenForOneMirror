import {Component, OnInit, ViewChild} from '@angular/core';
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
import { Utils } from "../../infraestructura/Utils";
import {ModalDirective} from 'ng-uikit-pro-standard';

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit {
	@ViewChild("paymentModal") paymentModal: ModalDirective;

	public groups: GroupGame[] = [];
	public user: User;
	public userIsAdmin = false;
	public groupSelectedPayModal: GroupGame;

	constructor(
		private groupService: GroupService,
		private authService: AuthService,
		private purchaseService: PurchaseService,
		private updateMoneyService: UpdateMoneyService,
		private router: Router
	) {
	  this.groupSelectedPayModal = new GroupGame();
  }

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

	buyEntranceGroup() {
		const member = new MemberGroup();
		member.payReference = "payreferenceuser";
		this.groupService.addMemberToGroup(member, this.groupSelectedPayModal._id).subscribe(() => {
			swal.fire("Info", "The registration has been successful!", "success").then(() => {
				this.updateMoneyService.update(true);
				this.router.navigate(["/game", this.groupSelectedPayModal._id]);
			});
		});
	}

	validateMemberIsNotAlreadyRegistered(groupId) {
		this.groupService.getGroup(groupId).subscribe(group => {
			const userIsAlreadyInGroup = this.groupService.filterMemberByGroup(group, this.user._id);
			this.actionViewGroup(userIsAlreadyInGroup, groupId);
		});
	}

	actionViewGroup(already, groupId) {
		if (this.userIsAdmin) {
			this.router.navigate(["/game", groupId]);
		} else {
			if (already) {
				this.router.navigate(["/game", groupId]);
			} else {
				Utils.showMsgInfo("You need buy  a entrance to the group!");
			}
		}
	}

  showPaymentModal(group: GroupGame) {
	  this.groupSelectedPayModal = group;
	  this.paymentModal.show();
  }
}
