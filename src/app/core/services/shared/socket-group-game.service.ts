import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { environment } from "../../../../environments/environment";
import { EventEnum } from "../../../enums/EventEnum";
import { Observable } from "rxjs";
import { NameSpaceEnum } from "../../../enums/NameSpaceEnum";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "../auth/auth.service";

@Injectable({
	providedIn: "root"
})
export class SocketGroupGameService {
	private socket;

	constructor(private logger: NGXLogger, private authService: AuthService) {}

	public connect() {
	  if (!this.socket) {
      const userName = this.authService.getUser().userName;
      this.logger.info('CONNECT TO TO SOCKET GAME');
      this.socket = socketIo.connect(environment.socket + "/" + NameSpaceEnum.groupGame, { query: { userName } });

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
			this.logger.info("CLOSE MAIN SOCKET");
			this.socket.close();
		}
	}

	public removeAllListeners() {
		this.logger.info("Remove all listeners game socket");
		this.socket.removeAllListeners();
	}
}
