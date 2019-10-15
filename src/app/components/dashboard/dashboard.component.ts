import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	ViewChild
} from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { UserService } from "../../core/services/shared/user.service";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { GameService } from "../../core/services/shared/game.service";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";
import { NGXLogger } from "ngx-logger";
import { NgxSpinnerService } from "ngx-spinner";
import { MdbTableDirective, MdbTablePaginationComponent, ToastService } from "ng-uikit-pro-standard";

enum tabEnum {
	ADMIN,
	USER
}

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
	// DATATABLES PROPERTIES
	@ViewChild("tableEl") tableEl: MdbTableDirective;
	@ViewChild("tableEl2") tableEl2: MdbTableDirective;
	@ViewChild("mdbTablePagination") mdbTablePagination: MdbTablePaginationComponent;
	@ViewChild("mdbTablePagination2") mdbTablePagination2: MdbTablePaginationComponent;
	@ViewChild("row") row: ElementRef;

	headElements = ["#", "Usuario", "Nombres", "Apellidos", "Correo", "Estado", "Acción"];

	sortByElements = ["#", "userName", "firstName", "lastName", "email", "estado", "action"];

	searchText = "";
	previous: string;
	previous2: string;
	keyword = "de";

	maxVisibleItems = 15;

	// END DATATABLE PROPERTIES
	public existsRegisteredUsers = true;
	public existsRegisteredAdmins = true;
	public optionsToast = { toastClass: "opacity" };
	ngUnsubscribe = new Subject<void>();
	public groupsAdmin: Observable<GroupGame[]>;
	public groupsUser: GroupGame[] = [];
	public admins: User[] = [];
	public users: User[] = [];
	public user: User;
	public isUserAdmin = false;
	public group: GroupGame;
	public showWelcomeUser = true;
	public iterationValue = 1;
	public tabSelectected: tabEnum = tabEnum.ADMIN;

	elements: any = [];

	constructor(
		private groupService: GroupService,
		private userService: UserService,
		private gameService: GameService,
		private authService: AuthService,
		private socketGroupGame: SocketGroupGameService,
		private router: Router,
		private logger: NGXLogger,
		private spinner: NgxSpinnerService,
		private cdRef: ChangeDetectorRef,
		private toast: ToastService
	) {}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.isUserAdmin = this.authService.userIsAdmin();
		this.spinner.show();
		this.createContentDashboard(this.isUserAdmin);
	}

	@HostListener("input") oninput() {
		if (this.tabSelectected === tabEnum.ADMIN) {
			this.mdbTablePagination.searchText = this.searchText;
		} else {
			this.mdbTablePagination2.searchText = this.searchText;
		}

		this.searchElements();
	}

	searchElements() {
		if (this.tabSelectected === tabEnum.ADMIN) {
			const prev = this.tableEl.getDataSource();

			if (!this.searchText) {
				this.tableEl.setDataSource(this.previous);
				this.admins = this.tableEl.getDataSource();
			}

			if (this.searchText) {
				this.admins = this.tableEl.searchLocalDataBy(this.searchText);
				this.tableEl.setDataSource(prev);
			}
		} else {
			const prev = this.tableEl2.getDataSource();

			if (!this.searchText) {
				this.tableEl2.setDataSource(this.previous2);
				this.users = this.tableEl2.getDataSource();
			}

			if (this.searchText) {
				this.users = this.tableEl2.searchLocalDataBy(this.searchText);
				this.tableEl.setDataSource(prev);
			}
		}
	}

	ngAfterViewInit(): void {
		if (this.isUserAdmin) {
			this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);
			this.mdbTablePagination2.setMaxVisibleItemsNumberTo(this.maxVisibleItems);
			this.paginationAdmins();
			this.paginationUsers();
			this.cdRef.detectChanges();
		}
	}

	paginationAdmins() {
		this.mdbTablePagination.calculateFirstItemIndex();
		this.mdbTablePagination.calculateLastItemIndex();
	}

	paginationUsers() {
		this.mdbTablePagination2.calculateFirstItemIndex();
		this.mdbTablePagination2.calculateLastItemIndex();
	}

	createContentDashboard(userIsAdmin) {
		if (!userIsAdmin) {
			this.getGroupsOfCurrentUser();
		} else {
			this.socketGroupGame.connect();
			this.getGroupsAdmin();
			this.getAllUsers();
		}
	}

	getGroupsAdmin() {
		this.groupsAdmin = this.groupService.getGroups();
	}

	getAllUsers() {
		this.userService
			.getUsers(true)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(users => {
				// ADMINS
				this.admins = users;
				this.admins = this.userService.filterUsersByRol(users, RoleEnum.Admin);

				this.tableEl.setDataSource(this.admins);
				this.admins = this.tableEl.getDataSource();
				this.previous = this.tableEl.getDataSource();

				if (this.admins.length === 0) {
					this.existsRegisteredAdmins = false;
				}

				// USERS
				this.users = users;
				this.users = this.userService.filterUsersByRol(users, RoleEnum.User);

				this.tableEl2.setDataSource(this.users);
				this.users = this.tableEl2.getDataSource();
				this.previous2 = this.tableEl2.getDataSource();

				if (this.users.length === 0) {
					this.existsRegisteredUsers = false;
				}

				this.spinner.hide();
			});
	}

	getGroupsOfCurrentUser() {
		this.groupService
			.getGroupsCurrentUser(this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(response => {
				this.groupsUser = response;

				if (this.groupsUser.length > 0) this.showWelcomeUser = false;

				this.groupsUser.forEach((group, index) => {
					if (index === 0) this.socketGroupGame.connect();

					this.socketGroupGame.onEventGroup(EventEnum.GROUP_ACTIVITY + group.initialInvertion).subscribe(data => {
						this.logger.info("ACTIVTY-GROUP: " + group.initialInvertion, data);
						this.iterationValue = 0;
						group.dataUserWin = data;
						this.socketGroupGame.animationNewPlayer(group);
					});

					group.circleUsers = this.gameService.generateCircles(group.members, group.lastWinner, this.user);
					group.circleUsersPlaying = this.gameService.getCircleUserPlaying(group.circleUsers);
					// group.circleUsersPlaying = group.circleUsersPlaying.reverse();
				});
				this.spinner.hide();
			});
	}

	viewGroupUsers(groupId) {
		this.router.navigate(["/game", groupId]);
	}

	groupsDashboard() {
		this.router.navigate(["/groups"]);
	}

	disableUser(user: User) {
		if (!user.enabled) {
			this.toast.info("El usuario: " + user.userName + " ya se encuentra inhabilitado!", "Usuario", this.optionsToast);
		} else {
			this.userService
				.changeStateUser(user._id, false)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(resp => {
					user.enabled = false;
					this.toast.info("El usuario: " + user.userName + " ha sido inhabilitado!", "Usuario", this.optionsToast);
				});
		}
	}

	enableUser(user: User) {
		if (user.enabled) {
			this.toast.info("El usuario: " + user.userName + " ya se encuentra habilitado!", "Usuario", this.optionsToast);
		} else {
			this.userService
				.changeStateUser(user._id, true)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(resp => {
					user.enabled = true;
					this.toast.info("El usuario: " + user.userName + " ha sido habilitado!", "Usuario", this.optionsToast);
				});
		}
	}

	selectTabAdmins(event: any) {
		this.tabSelectected = tabEnum.ADMIN;
	}

	selectTabUsers(event: any) {
		this.tabSelectected = tabEnum.USER;
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.socketGroupGame.removeAllListeners();
	}
}
