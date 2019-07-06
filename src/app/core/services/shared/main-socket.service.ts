import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { EventEnum } from "../../../enums/EventEnum";
import { NGXLogger } from "ngx-logger";

@Injectable({
	providedIn: "root"
})
export class MainSocketService {
	private socket;

	constructor(private logger: NGXLogger) {}

	public connect() {
		this.socket = socketIo.connect(environment.socket);
	}

	public send(event: EventEnum, payload: string): void {
    this.logger.info('MAIN SOCKET EVENT EMIT: ' + event);
		this.socket.emit(event, payload);
	}

	public onEvent(event: EventEnum): Observable<any> {
    this.logger.info('MAIN SOCKET EVENT ON: ' + event);
		return new Observable<EventEnum>(observer => {
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
		this.logger.info("Remove all listeners main socket");
		this.socket.removeAllListeners();
	}
}
