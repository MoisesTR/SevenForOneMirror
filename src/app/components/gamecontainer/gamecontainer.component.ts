import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MemberGroup} from "../../models/MemberGroup";
import {User} from "../../models/User";
import {GroupGame} from "../../models/GroupGame";
import {AuthService} from "../../core/services/auth/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {GroupService} from "../../core/services/shared/group.service";
import {RoleEnum} from "../../enums/RoleEnum";
import {GameService} from "../../core/services/shared/game.service";
import {SocketGroupGameService} from "../../core/services/shared/socket-group-game.service";
import {EventEnum} from "../../enums/EventEnum";
import {NGXLogger} from "ngx-logger";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ModalDirective} from "ng-uikit-pro-standard";
import {TopService} from "../../core/services/shared/top.service";
import {Winner} from "../../models/Winner";
import {NgxSpinnerService} from "ngx-spinner";
import {Utils} from "../../infraestructura/Utils";

@Component({
	selector: "app-gamecontainer",
	templateUrl: "./gamecontainer.component.html",
	styleUrls: ["./gamecontainer.component.scss"]
})
export class GamecontainerComponent implements OnInit, AfterViewInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public group: GroupGame;
	public groupSelected = new GroupGame();
	public members: MemberGroup[] = [];
	public userActual: User;
	public idGroup: string;
	public isUserAdmin = false;
	public topWinners3: Winner[] = [];
	public topWinners7: Winner[] = [];
	public concurrentWinners3: Winner[] = [];
	public concurrentWinners7: Winner[] = [];
	public messageWin = " ";
	public iterationValue = 1;
	@ViewChild("modalWin") modalWin: ModalDirective;
	@ViewChild("topPlayers") topPlayers: ModalDirective;
	@ViewChild("topPlayersConcurrent") topPlayersConcurrent: ModalDirective;

	constructor(
		private activatedRoute: ActivatedRoute,
		private groupService: GroupService,
		private authService: AuthService,
		private gameService: GameService,
		private socketGroupGame: SocketGroupGameService,
		private topService: TopService,
		private spinner: NgxSpinnerService,
		private router: Router,
		private logger: NGXLogger
	) {}

	ngOnInit() {
		this.getUser();
		this.getParams();
		this.initSocketGroupGame();
	}

	ngAfterViewInit(): void {
		if (this.socketGroupGame.userHasWin) {
			setTimeout(() => {
				this.socketGroupGame.userHasWin = false;
				this.messageWin = this.socketGroupGame.messageWin;
				this.modalWin.show();
				this.socketGroupGame.celebration();
			}, 2000);
		}
	}

	getUser() {
		this.userActual = this.authService.getUser();
		this.isUserAdmin = this.userActual.role.name === RoleEnum.Admin;
	}

	getParams() {
		this.activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
			this.idGroup = params["idGroup"];

			if (this.idGroup) {
				this.getMembersGroup(this.idGroup);
			}
		});
	}

	initSocketGroupGame() {
		this.socketGroupGame.connect();
	}

	getMembersGroup(idGroup) {
		this.spinner.show();
		this.groupService
			.getGroup(idGroup)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(group => {
				this.groupSelected = group;

				this.initSocketGroupActivity(group);

				this.members = this.groupSelected.members;
				this.groupSelected.circleUsers = this.gameService.generateCircles(
					this.members,
					this.groupSelected.lastWinner,
					this.userActual
				);
				this.groupSelected.circleUsersPlaying = this.gameService.getCircleUserPlaying(this.groupSelected.circleUsers);
				// this.circleUserPlaying = this.circleUserPlaying.reverse();
				this.spinner.hide();
			});
	}

	initSocketGroupActivity(group: GroupGame) {
		this.socketGroupGame.onEventGroup(EventEnum.GROUP_ACTIVITY + group.initialInvertion).subscribe(data => {
			this.logger.info("ACTIVTY GROUP: ", group, data);
			this.iterationValue = 0;
			this.socketGroupGame.animationNewPlayer(data, group);
		});
	}

	clainEvent() {
		this.modalWin.hide();
		this.router.navigateByUrl("win-history");
	}

	top10WinnersByGroupId() {
		this.topService
			.getTop10WinnersByGroupId(this.idGroup)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((winners: Winner[]) => {
				this.topWinners3 = [];
				this.topWinners7 = [];
				winners.forEach((winner, index) => {
					if (index <= 2) {
						winner.trophyImageSrc = "/assets/images/" + `Grupo${index + 1}B.png`;

						this.topWinners3.push(winner);
					}
					if (index > 2) {
						this.topWinners7.push(winner);
					}
				});

				if (winners.length > 0) {
					this.topPlayers.show();
				} else {
					Utils.showMsgInfo("No hay ganadores en este grupo actualmente!");
				}
			});
	}

	top10WinnersConcurrent() {
		this.topService
			.getTop10ConcurrentWinners(this.idGroup)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((concurrentWinners: Winner[]) => {
				this.concurrentWinners3 = [];
				this.concurrentWinners7 = [];
				concurrentWinners.forEach((concurrentWinner, index) => {
					if (index <= 2) {
						concurrentWinner.trophyImageSrc = "/assets/images/" + `Grupo${index + 1}B.png`;

						this.concurrentWinners3.push(concurrentWinner);
					}
					if (index > 2) {
						this.concurrentWinners7.push(concurrentWinner);
					}
				});

				if (concurrentWinners.length > 0) {
					this.topPlayersConcurrent.show();
				} else {
					Utils.showMsgInfo("No hay ganadores en este grupo actualmente!");
				}
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.socketGroupGame.removeAllListeners();
	}
}
