import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import {MemberGroup} from '../../models/MemberGroup';

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit {
	public groups: GroupGame[] = [];

	constructor(private groupService: GroupService, private router: Router) {}

	ngOnInit() {
		this.getGroups();
	}

	getGroups() {
		this.groupService.getGroups().subscribe(groups => {
			this.groups = groups;
		});
	}

	addMemberToGroup(groupId) {
	  const member = new MemberGroup();

	  this.groupService.addMemberToGroup(member, groupId)
  }

	goButton(index, groupId) {
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
					this.router.navigate(["/game"]);
				}
			});
	}
}
