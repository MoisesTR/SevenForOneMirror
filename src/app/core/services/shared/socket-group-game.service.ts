import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { environment } from "../../../../environments/environment";
import { EventEnum } from "../../../enums/EventEnum";
import { Observable } from "rxjs";
import { NameSpaceEnum } from "../../../enums/NameSpaceEnum";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "../auth/auth.service";
import confetti from "canvas-confetti";
import { MemberGroup } from "../../../models/MemberGroup";
import { CircleUser } from "../../../models/CircleUser";
import { GameService } from "./game.service";
import { GroupGame } from "../../../models/GroupGame";

@Injectable({
	providedIn: "root"
})
export class SocketGroupGameService {
	private socket;
	public userHasWin = false;
	public recentBuyTicketGroup = false;
	public messageWin = " ";
	constructor(private logger: NGXLogger, private authService: AuthService, private gameService: GameService) {}

	public connect() {
		if (!this.socket) {
			const userName = this.authService.getUser().userName;
			this.logger.info("CONNECT TO TO SOCKET GAME");
			this.socket = socketIo.connect(environment.socket + "/" + NameSpaceEnum.groupGame, { query: { userName }, path: '/seven/socket.io', transports: ['websocket'] });

			this.onEvent(EventEnum.CONNECT).subscribe(() => {});
			this.onEvent(EventEnum.DISCONNECT).subscribe(() => {});
		}
	}

	public send(event: EventEnum, payload: string): void {
		this.logger.info("GAME SOCKET EVENT EMIT: " + event);
		this.socket.emit(event, payload);
	}

	public onEvent(event: EventEnum): Observable<any> {
		this.logger.info("GAME SOCKET EVENT ON: " + event);
		return new Observable<EventEnum>(observer => {
			this.socket.on(event, data => observer.next(data));
		});
	}

	public onEventGroup(event: string): Observable<any> {
		this.logger.info("GAME SOCKET EVENT ON: " + event);
		return new Observable<String>(observer => {
			this.socket.on(event, data => observer.next(data));
		});
	}

	public closeSocket() {
		if (this.socket) {
			this.logger.info("CLOSE GAME SOCKET");
			this.socket.close();
		}
	}

	public removeListener(eventEnum: string) {
		this.socket.remote(eventEnum);
	}

	public removeAllListeners() {
		if (this.socket) {
			this.logger.info("REMOVE ALL LISTENERS GAME SOCKET");
			this.socket.removeAllListeners();
		}
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
				particleCount: 150,
				origin: {
					x: Math.random(),
					// since they fall down, start a bit higher than random
					y: Math.random() - 0.2
				},
				colors: colors
			});
		}, 200);
	}

	animationNewPlayer(group: GroupGame) {
		this.logger.info("GENERATE ANIMATION BY MULTIPLES GROUPS");
		const memberGroup = new MemberGroup();
		memberGroup.userId = group.dataUserWin.userId;
		memberGroup.image = group.dataUserWin.image;
		memberGroup.userName = group.dataUserWin.userName;

		const circleUser: CircleUser = this.gameService.createCircle(memberGroup, 7);

		let circleUSersCopy = group.circleUsers.map(obj => ({ ...obj }));
		circleUSersCopy = circleUSersCopy.filter(c => c.position !== 1);

		// Desplazar los circulos una posicion hacia atras
		circleUSersCopy.forEach(circle => {
			circle.position = circle.position - 1;
		});

		circleUSersCopy.push(circleUser);

		group.circleUsers = circleUSersCopy.map(obj => ({ ...obj }));
		group.circleUsersPlaying = this.gameService.getCircleUserPlaying(circleUSersCopy).map(obj => ({ ...obj }));
	}
}
