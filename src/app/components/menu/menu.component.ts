import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../core/services/shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupGame, User } from "../../models/models.index";
import { RolService } from "../../core/services/shared/rol.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { PurchaseHistory } from "../../models/PurchaseHistory";
import { GroupService } from "../../core/services/shared/group.service";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";
import { MainSocketService } from "../../core/services/shared/main-socket.service";
import { EventEnum } from "../../enums/EventEnum";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { NGXLogger } from "ngx-logger";
import { takeUntil } from "rxjs/operators";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { ActionGameEnum } from "../../enums/ActionGameEnum";
import { RoleEnum } from "../../enums/RoleEnum";
import { MdbFileUploadComponent } from "mdb-file-upload";
import { Subject } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

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
	public fileToUpload: File;
	public messageWin = "";
	public usersOnline = 0;
	public registeredUsers = 0;
	public disableButtonUpload = false;
	@ViewChild("modalWin") modalWin: ModalDirective;
	@ViewChild("mdlAvatar") mdlAvatar: ModalDirective;
	@ViewChild("btnUploadImage") btnUploadImage: ElementRef;
	@ViewChild("uploader") uploader: MdbFileUploadComponent;

	formPaypalEmail: FormGroup;
	@ViewChild("mdlEmailPaypal") modalPaypal: ModalDirective;
	public disableButtonPaypalEmail = false;
	public optionsToast = { toastClass: "opacity" };

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private userService: UserService,
		private authService: AuthService,
		private purchaseHistoryService: PurchaseService,
		private groupService: GroupService,
		private updateMoneyService: UpdateMoneyService,
		private toastService: ToastService,
		private router: Router,
		private mainSocketService: MainSocketService,
		private gameSocketSevice: SocketGroupGameService,
		private logger: NGXLogger,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.getCredentialsUser();
		this.initSocket();
		this.dropdownAndScroll();
		this.getTotalEarned();
		this.initFormPaypalEmail();

		this.updateMoneyService.updateMount$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(update => {
			if (update) {
				this.logger.info("GET TOTAL EARNED");
				this.getTotalEarned();
			}
		});
	}

	showModalUpdateImage() {
		this.fileToUpload = undefined;
		this.uploader.reset();
		this.mdlAvatar.show();
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
			this.usersOnline = data.quantity;
		});

		this.mainSocketService.onEvent(EventEnum.WIN_EVENT).subscribe(data => {
			this.logger.info("WIN EVENT: ", data);

			this.updateMoneyService.update(true);
			this.logger.info("SHOW CELEBRATION TO WINNER");
			this.messageWin = data.content;
			this.modalWin.show();
			this.gameSocketSevice.celebration();
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

		this.mainSocketService.onEvent(EventEnum.LOGIN_AGAIN).subscribe(data => {
			this.logger.info("LOGIN AGAIN DATA", data);
		});

		this.mainSocketService.onEvent(EventEnum.CLOSE_SESSION).subscribe(data => {
			this.authService.logout();
			this.logger.info(EventEnum.CLOSE_SESSION + "DATA", data);
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
	}

	getCredentialsUser() {
		this.user = this.authService.getUser();
		this.isUserAdmin = this.authService.userIsAdmin();
	}

	getTotalEarned() {
		if (this.isUserAdmin) {
			this.getTotalEarnedGlobalGroups();
			this.getTotalUsersRegistered();
		} else {
			this.getPurchaseHistory();
			this.getGroupsCurrentUser();
		}
	}

	initFormPaypalEmail() {
		this.formPaypalEmail = this.formBuilder.group({
			emailPaypal: new FormControl(
				[this.user.paypalEmail],
				Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])
			)
		});
	}

	showModalPaypalEmail() {
		this.formPaypalEmail.reset();
		this.formPaypalEmail.controls["emailPaypal"].setValue(this.user.paypalEmail);
		this.modalPaypal.show();
	}

	updatePaypalEmail() {
		const paypalEmail = this.formPaypalEmail.value.emailPaypal;
		this.disableButtonPaypalEmail = true;

		this.userService
			.updatePaypalEmail(this.user._id, paypalEmail)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				() => {
					const user = this.user;
					user.paypalEmail = paypalEmail;
					this.authService.setCookieUser(user);

					this.disableButtonPaypalEmail = false;
					this.modalPaypal.hide();
					this.toastService.success("El correo de paypal ha sido actualizado!", "Paypal Email", this.optionsToast);
				},
				() => {
					this.disableButtonPaypalEmail = false;
				}
			);
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
					if (item.action === ActionGameEnum.INVEST) {
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

	getTotalUsersRegistered() {
		this.userService
			.getUsers(true)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(users => {
				this.registeredUsers = this.userService.filterUsersByRol(users, RoleEnum.User).length;
			});
	}

	groups() {
		this.router.navigateByUrl("/groups");
	}

	addGroup() {
		this.logger.info("CREATE GROUP");
		this.groupService.showModal();
	}

	addAdmin() {
		this.logger.info("CREATE ADMIN");
		this.userService.showModalAdmin();
	}

	dashBoard() {
		this.router.navigateByUrl("/dashboard");
	}

	updateProfile() {
		this.router.navigateByUrl("/profile");
	}

	changePassword() {
		this.userService.showModalChangePassword();
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

	onFileRemove() {
		this.fileToUpload = undefined;
	}

	onFileAdd(file: File) {
		this.fileToUpload = file;
	}

	uploadImage() {
		this.disableButtonUpload = true;
		this.userService
			.updateImage(this.fileToUpload)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				resp => {
					this.user = resp.data;
					this.logger.info("IMAGE UPDATE SUCCESSFULLY", resp);

					const options = { toastClass: "opacity" };
					this.toastService.success("La imagen ha sido actualizada!", "Imagen", options);

					this.disableButtonUpload = false;
					this.authService.setCookieUser(this.user);
					this.fileToUpload = undefined;
					this.mdlAvatar.hide();
				},
				() => {
					this.disableButtonUpload = false;
				}
			);
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.mainSocketService.removeAllListeners();
		this.mainSocketService.closeSocket();
	}

	clainEvent() {
		// this.modalWin.hide();
		this.router.navigateByUrl("/win-history");
	}
}
