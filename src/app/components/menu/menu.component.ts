import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../core/services/shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupGame, User } from "../../models/models.index";
import { RolService } from "../../core/services/shared/rol.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";
import confetti from "canvas-confetti";
import { MainSocketService } from "../../core/services/shared/main-socket.service";
import { EventEnum } from "../../enums/EventEnum";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ModalDirective } from "ng-uikit-pro-standard";

declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public user: User;
	public purchaseHistory: PurchaseHistory[] = [];
	public totalEarned = 0;
	public totalInvested = 0;
	public isUserAdmin = false;
	public currentGroupsUser: GroupGame[] = [];
	public closeSession = false;
	public messageWin = "";
	@ViewChild("modalWin") modalWin: ModalDirective;

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private userService: UserService,
		private authService: AuthService,
		private purchaseHistoryService: PurchaseService,
		private groupService: GroupService,
		private updateMoneyService: UpdateMoneyService,
		private router: Router,
		private mainSocketService: MainSocketService,
		private gameSocketSevice: SocketGroupGameService,
		private logger: NGXLogger
	) {}

	ngOnInit() {
		this.getCredentialsUser();
		this.initSocket();
		this.dropdownAndScroll();
		this.getTotalEarned();

		this.updateMoneyService.updateMount$.subscribe(update => {
			if (update) {
				this.logger.info("GET TOTAL EARNED");
				this.getTotalEarned();
			}
		});
	}

	initSocket() {
		this.mainSocketService.connect();

		this.mainSocketService.onEvent(EventEnum.CONNECT).subscribe(() => {
			this.mainSocketService.send(EventEnum.REGISTER_USER, this.authService.getUser().userName);

			if (this.isUserAdmin) {
				this.logger.info("JOIN ADMIN ROOM");
				this.mainSocketService.send(EventEnum.JOIN_ADMIN_ROOM, "");
			}
		});

		this.mainSocketService.onEvent(EventEnum.DISCONNECT).subscribe(() => {});

		this.mainSocketService.onEvent(EventEnum.CLOSE_SESSION).subscribe(() => {
			this.closeSession = true;
			this.logger.info("CLOSE SESSION ANOTHER SCREEN");
			this.router.navigateByUrl("locked-screen");
		});

		this.mainSocketService.onEvent(EventEnum.PLAYERS_ONLINE).subscribe(data => {
			this.logger.info("PLAYERS ONLINE: ", data.quantity);
		});

		this.mainSocketService.onEvent(EventEnum.WIN_EVENT).subscribe(data => {
			this.logger.info("WIN EVENT: ", data);

			if (this.authService.getUser()._id !== Number(data.userId)) {
				this.logger.info("SHOW CELEBRATION FOR USER ACTUAL");
				this.messageWin = data.content;
				this.modalWin.show();
				this.gameSocketSevice.celebration();
			} else {
				this.logger.info("SHOW CELEBRATION FOR ANOTHER USER");
				this.gameSocketSevice.messageWin = data.content;
				this.gameSocketSevice.userHasWin = true;
			}
		});

		this.mainSocketService.onEvent(EventEnum.TOP_WINNER).subscribe(data => {
			this.logger.info("TOP WINNERS", data);
		});

		this.mainSocketService.onEvent(EventEnum.NOTIFICATION).subscribe(data => {
			this.logger.info("NOTIFICATION", data);
		});

		this.mainSocketService.onEvent(EventEnum.UPDATE_PURCHASE_HISTORY_USER).subscribe(data => {
			this.logger.info("UPDATE PURCHASE HISTORY USER", data);
		});
	}

	dropdownAndScroll() {
		$(document).ready(() => {
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
		if (this.isUserAdmin) {
			this.getTotalEarnedGlobalGroups();
		} else {
			this.getPurchaseHistory();
			this.getGroupsCurrentUser();
		}
	}

	getPurchaseHistory() {
		this.logger.info("GET PURCHASE HISTORY IN MENU");
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.purchaseHistoryService
			.getPurchaseHistoryByIdUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(history => {
				this.purchaseHistory = history;
				for (const item of this.purchaseHistory) {
					const quantity = +item.quantity["$numberDecimal"];
					if (item.moneyDirection) {
						this.totalInvested += quantity;
					} else {
						this.totalEarned += quantity;
					}
				}
			});
	}

	getTotalEarnedGlobalGroups() {
		this.logger.info("GET TOTAL EARNED GLOBAL GROUPS");
		this.totalEarned = 0;
		this.totalInvested = 0;
		this.groupService
			.getGroups()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(groups => {
				groups.forEach(group => {
					if (group.enabled) {
						this.totalEarned += group.totalInvested;
					}
				});
			});
	}

	getGroupsCurrentUser() {
		this.logger.info("GET GROUPS CURRENT USER IN MENU");
		this.groupService
			.getGroupsCurrentUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(groups => {
				this.currentGroupsUser = this.groupService.getGroupsPlayingUser(groups, this.user._id);
			});
	}

	groups() {
		this.router.navigateByUrl("/groups");
	}

	dashBoard() {
		this.router.navigateByUrl("/dashboard");
	}

	updateProfile() {
		this.router.navigateByUrl("/profile");
	}

	logout() {
		this.closeSockets();
		this.authService.logout();
	}

	closeSockets() {
		this.mainSocketService.removeAllListeners();
		this.gameSocketSevice.removeAllListeners();

		this.mainSocketService.closeSocket();
		this.gameSocketSevice.closeSocket();
	}

	onActivate(edvent) {
		window.scroll(0, 0);
	}

	onFileRemove() {}

	onFileAdd(event) {}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.mainSocketService.removeAllListeners();
		this.mainSocketService.closeSocket();
	}

	clainEvent() {
		this.modalWin.hide();
		this.router.navigateByUrl("win-history");
	}
}
