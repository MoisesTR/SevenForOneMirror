import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { Utils } from "../../infraestructura/Utils";
import {SocketGroupGameService} from "../../core/services/shared/socket-group-game.service";

declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit, OnDestroy {
	public user: User;
	public purchaseHistory: PurchaseHistory[] = [];
	public totalEarned = 0;
	public totalInvested = 0;
	public isUserAdmin = false;
	public disableUpdateAmounts = false;
	public currentGroupsUser: GroupGame[] = [];
	public closeSession = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private usuarioService: UserService,
		private authService: AuthService,
		private purchaseHistoryService: PurchaseService,
		private groupService: GroupService,
		private updateMoneyService: UpdateMoneyService,
		private router: Router,
		private mainSocketService: MainSocketService,
    private gameSocketService: SocketGroupGameService
	) {}

	ngOnInit() {
		this.getCredentialsUser();
		this.initSocket();
		this.dropdownAndScroll();
		this.getTotalEarned();

		this.updateMoneyService.updateMount$.subscribe(update => {
			if (update) {
				this.getTotalEarned();
			}
		});
	}

	initSocket() {
		this.mainSocketService.connect();

		this.mainSocketService.onEvent(EventEnum.CONNECT).subscribe(() => {
			console.log("Evento de conexion");

			this.mainSocketService.send(EventEnum.REGISTER_USER, this.authService.getUser().userName);

			if (this.isUserAdmin) {
				console.log("JOIN_ADMIN_ROOM");
				this.mainSocketService.send(EventEnum.JOIN_ADMIN_ROOM, "");
			}
		});

		this.mainSocketService.onEvent(EventEnum.DISCONNECT).subscribe(() => {
			console.log("Evento de desconexion");
		});

		this.mainSocketService.onEvent(EventEnum.CLOSE_SESSION).subscribe(() => {
			this.closeSession = true;
			this.router.navigateByUrl("locked-screen");
			// Utils.showMsgInfo('7X1 Esta abierto en otra ventana. Haz click en "USAR AQUI" para abrir 7x1 en esta ventana!');
			console.log("CLOSE SESSION");
		});

		this.mainSocketService.onEvent(EventEnum.PLAYERS_ONLINE).subscribe(data => {
			console.log("Jugadores en linea");
			console.log(data.quantity);
		});

		this.mainSocketService.onEvent(EventEnum.WIN_EVENT).subscribe(data => {
			Utils.showMsgInfo("Un usuario ha ganado!");
			console.log(data);
		});

		this.mainSocketService.onEvent(EventEnum.TOP_WINNER).subscribe(data => {
			console.log("TOP WINNERS");
			console.log(data);
		});
	}

	celebration() {
		const end = Date.now() + 5000;

		const colors = ["#42d583", "#448aff"];

		const interval = setInterval(function() {
			if (Date.now() > end) {
				return clearInterval(interval);
			}

			confetti({
				startVelocity: 30,
				spread: 360,
				ticks: 60,
				particleCount: 220,
				origin: {
					x: Math.random(),
					// since they fall down, start a bit higher than random
					y: Math.random() - 0.2
				},
				colors: colors
			});
		}, 200);
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
					const quantity = +item.quantity["$numberDecimal"];
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
				groups.forEach(group => {
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
			this.currentGroupsUser = this.groupService.getGroupsPlayingUser(groups, this.user._id);
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
		this.closeSockets();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}

	closeSockets() {
	  this.mainSocketService.closeSocket();
    this.gameSocketService.closeSocket();
  }

	onActivate(edvent) {
		window.scroll(0, 0);
	}

	onFileRemove() {}

	onFileAdd(event) {}

	ngOnDestroy(): void {
		console.log("El componente menu se ha destruido");
	}
}
