import { Component, OnInit } from "@angular/core";
import { UserService } from "../../core/services/shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Token, User } from "../../models/models.index";
import { RolService } from "../../core/services/shared/rol.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";
import { IndividualGroup } from "../../models/IndividualGroup";

declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
	public token: Token;
	public user: User;
	public purchaseHistory: PurchaseHistory[] = [];
	public totalEarned = 0;
	public totalInvested = 0;
	public isUserAdmin = false;
	public disableUpdateAmounts = false;
	public currentGroupsUser: IndividualGroup[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private usuarioService: UserService,
		private authService: AuthService,
		private purchaseHistoryService: PurchaseService,
		private groupService: GroupService,
		private updateMoneyService: UpdateMoneyService,
		private router: Router
	) {
		this.token = new Token();
	}

	ngOnInit() {
		this.dropdownAndScroll();
		this.getCredentialsUser();
		this.getTotalEarned();

		this.updateMoneyService.updateMount$.subscribe(update => {
			if (update) {
				this.getTotalEarned();
			}
		});
	}

	dropdownAndScroll() {
		$(document).ready(() => {
			$(".dropify").dropify();

			$(document).scroll(function() {
				if ($(this).scrollTop() >= 20) {
					$("#return-to-top").fadeIn(200);
				} else {
					$("#return-to-top").fadeOut(200);
				}
			});
		});

		function fixNavDropdown() {
			if ($(window).width() >= 992) {
				$(".navbar .dropdown-menu").addClass("dropdown-menu-right");
			} else {
				$(".navbar .dropdown-menu").removeClass("dropdown-menu-right");
			}
		}

		$(window).resize(function() {
			fixNavDropdown();
		});

		fixNavDropdown();
	}

	getCredentialsUser() {
		this.user = this.authService.getUser();
		this.isUserAdmin = this.user.role.name === RoleEnum.Admin;
	}

	getTotalEarned() {
		this.disableUpdateAmounts = true;
		if (this.isUserAdmin) {
			this.getTotalEarnedGlobalGroups();
		} else {
			this.getPurchaseHistory();
			this.getGroupsCurrentUser();
		}
	}

	getPurchaseHistory() {
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.purchaseHistoryService.getPurchaseHistoryByIdUser(this.user._id).subscribe(
			history => {
				this.purchaseHistory = history;
				for (const item of this.purchaseHistory) {
					const quantity = (+item.quantity["$numberDecimal"]);
					if (item.moneyDirection) {
						this.totalInvested += quantity;
					} else {
						this.totalEarned += quantity;
					}
				}
				this.disableUpdateAmounts = false;
			},
			() => {
				this.disableUpdateAmounts = false;
			}
		);
	}

	getTotalEarnedGlobalGroups() {
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.groupService.getGroups().subscribe(
			groups => {
				groups.forEach((group, index) => {
					if (group.enabled) {
						this.totalEarned += group.totalInvested;
					}
				});
				this.disableUpdateAmounts = false;
			},
			() => {
				this.disableUpdateAmounts = false;
			}
		);
	}

	getGroupsCurrentUser() {
		this.groupService.getGroupsCurrentUser(this.user._id).subscribe(groups => {
			this.currentGroupsUser = this.groupService.getIndividualGroups(groups, this.user._id);
		});
	}

	groups() {
		this.router.navigate(["/groups"]);
	}

	dashBoard() {
		this.router.navigate(["/dashboard"]);
	}

	updateProfile() {
		this.router.navigate(["/profile"]);
	}

	logout() {
		localStorage.clear();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}

	onActivate(edvent) {
		window.scroll(0, 0);
	}
}
