import { Component, OnInit } from "@angular/core";
import { UserService } from "../../core/services/shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Token, User } from "../../models/models.index";
import { RolService } from "../../core/services/shared/rol.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../enums/RoleEnum";

declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
	public token: Token;
	public userActual: User;
	public usuarios: User[] = [];
	public purchaseHistory: PurchaseHistory[] = [];
	public totalEarned = 0;
	public totalInvested = 0;
	public isUserAdmin = false;
	public disableUpdateAmounts = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private usuarioService: UserService,
		private authService: AuthService,
		private purchaseHistoryService: PurchaseService,
		private groupService: GroupService,
		private router: Router
	) {
		this.token = new Token();
	}

	ngOnInit() {
		this.dropdownAndScroll();
		this.getCredentialsUser();
		this.getTotalEarned();
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
			if ($(window).width() <= 575) {
				$(".navbar .dropdown-menu").removeClass("dropdown-menu-right");
			} else {
				$(".navbar .dropdown-menu").addClass("dropdown-menu-right");
			}
		}

		$(window).resize(function() {
			fixNavDropdown();
		});

		fixNavDropdown();
	}

	getCredentialsUser() {
		this.userActual = this.authService.getUser();
		this.isUserAdmin = this.userActual.role.name === RoleEnum.Admin;
	}

	getTotalEarned() {
		this.disableUpdateAmounts = true;
		this.totalEarned = 0;
		this.totalInvested = 0;
		if (this.userActual.role.name === RoleEnum.User) {
			this.getPurchaseHistory();
		} else {
			this.getTotalEarnedGlobalGroups();
		}
	}

	getPurchaseHistory() {
		this.purchaseHistoryService.getPurchaseHistoryByIdUser(this.authService.getUser()._id).subscribe(
			history => {
				this.purchaseHistory = history;
				for (const item of this.purchaseHistory) {
					if (item.moneyDirection) {
						this.totalInvested += +item.quantity["$numberDecimal"];
					} else {
						this.totalEarned += +item.quantity["$numberDecimal"];
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
}
