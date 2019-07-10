import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { AuthService } from "../../core/services/auth/auth.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { GameService } from "../../core/services/shared/game.service";
import { CircleUser } from "../../models/CircleUser";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ModalDirective } from "ng-uikit-pro-standard";

@Component({
	selector: "app-gamecontainer",
	templateUrl: "./gamecontainer.component.html",
	styleUrls: ["./gamecontainer.component.scss"]
})
export class GamecontainerComponent implements OnInit, AfterViewInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public group: GroupGame;
	public groupSelected: GroupGame;
	public members: MemberGroup[] = [];
	public userActual: User;
	public idGroup: number;
	public isUserAdmin = false;
	public circleUsers: CircleUser[] = [];
	public circleUserPlaying: CircleUser[] = [];
	public messageWin = " ";
	public iterationValue = 1;
	@ViewChild("modalWin") modalWin: ModalDirective;

	constructor(
		private activatedRoute: ActivatedRoute,
		private groupService: GroupService,
		private authService: AuthService,
		private gameService: GameService,
		private socketGroupGame: SocketGroupGameService,
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
			this.socketGroupGame.userHasWin = false;
			this.messageWin = this.socketGroupGame.messageWin;
			setTimeout(() => {
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
		this.groupService
			.getGroup(idGroup)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(group => {
				this.groupSelected = group;

				this.initSocketGroupActivity(group);

				this.members = this.groupSelected.members;
				this.circleUsers = this.gameService.generateCircles(
					this.members,
					this.groupSelected.lastWinner,
					this.userActual
				);
				this.circleUserPlaying = this.gameService.getCircleUserPlaying(this.circleUsers);
				// this.circleUserPlaying = this.circleUserPlaying.reverse();
			});
	}

	initSocketGroupActivity(group: GroupGame) {
		this.socketGroupGame.onEventGroup(EventEnum.GROUP_ACTIVITY + group.initialInvertion).subscribe(data => {
			this.logger.info("ACTIVTY GROUP: ", group, data);
			this.animationNewPlayer(data);
		});
	}

	animationNewPlayer(data) {
		this.logger.info("GENERATE ANIMATION BY GROUP");
		const memberGroup = new MemberGroup();
		memberGroup.userId = data.userId;
		memberGroup.image = data.image;
		memberGroup.userName = data.userName;
		const circleUser: CircleUser = this.gameService.createCircle(memberGroup, 7);

		let circleUSersCopy = Object.assign([], this.circleUsers);
		circleUSersCopy = circleUSersCopy.filter(c => c.position !== 1);

		// Desplazar los circulos una posicion hacia atras
		circleUSersCopy.forEach((circle, index) => {
			circle.position = circle.position - 1;
		});

		circleUSersCopy.push(circleUser);
		this.iterationValue = 0;
		this.circleUsers = Object.assign([], circleUSersCopy);
		this.circleUserPlaying = Object.assign([], this.gameService.getCircleUserPlaying(circleUSersCopy));
	}

	clainEvent() {
		this.modalWin.hide();
		this.router.navigateByUrl("win-history");
	}
	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.socketGroupGame.removeAllListeners();
	}
}
