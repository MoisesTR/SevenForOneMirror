import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { GroupGame } from "../../models/GroupGame";
import { AuthService } from "../../core/services/auth/auth.service";
import { ActivatedRoute, Params } from "@angular/router";
import { GroupService } from "../../core/services/shared/group.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { GameService } from "../../core/services/shared/game.service";
import { CircleUser } from "../../models/CircleUser";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-gamecontainer",
	templateUrl: "./gamecontainer.component.html",
	styleUrls: ["./gamecontainer.component.scss"]
})
export class GamecontainerComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public group: GroupGame;
	public groupSeleccionado: GroupGame;
	public members: MemberGroup[] = [];
	public userActual: User;
	public idGroup: number;
	public isUserAdmin = false;
	public circleUsers: CircleUser[] = [];
	public circleUserPlaying: CircleUser[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private groupService: GroupService,
		private authService: AuthService,
		private gameService: GameService,
		private socketGroupGame: SocketGroupGameService,
		private logger: NGXLogger
	) {}

	ngOnInit() {
		this.getUser();
		this.getParams();
		this.initSocketGroupGame();
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
				this.groupSeleccionado = group;

				this.initSocketGroupActivity(group);

				this.members = this.groupSeleccionado.members;
				this.circleUsers = this.gameService.generateCircles(
					this.members,
					this.groupSeleccionado.lastWinner,
					this.userActual
				);
				this.circleUserPlaying = this.gameService.getCircleUserPlaying(this.circleUsers);
				// this.circleUserPlaying = this.circleUserPlaying.reverse();
			});
	}

	initSocketGroupActivity(group: GroupGame) {
		this.socketGroupGame.onEventGroup(EventEnum.GROUP_ACTIVITY + group.initialInvertion).subscribe(member => {
			this.logger.info("ACTIVTY-GROUP", "TEST");
		});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.socketGroupGame.removeAllListeners();
	}
}
