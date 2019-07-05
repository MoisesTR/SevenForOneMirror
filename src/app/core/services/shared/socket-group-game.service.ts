import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { environment } from "../../../../environments/environment";
import { EventEnum } from "../../../enums/EventEnum";
import { Observable } from "rxjs";
import { NameSpaceEnum } from "../../../enums/NameSpaceEnum";

@Injectable({
	providedIn: "root"
})
export class SocketGroupGameService {
	private socket;

	constructor() {
		this.socket = socketIo.connect(environment.socket + '/' + NameSpaceEnum.groupGame);

		this.onEvent(EventEnum.CONNECT).subscribe(() => {
			console.log("Conectado al namespace de group game");
		});
		this.onEvent(EventEnum.DISCONNECT).subscribe(() => {
			console.log("Desconectado del namespace de group game");
		});
	}

	public send(event: EventEnum, payload: string): void {
		this.socket.emit(event, payload);
	}

	public onEvent(event: EventEnum ): Observable<any> {
		return new Observable<EventEnum>(observer => {
			this.socket.on(event, (data) => observer.next(data));
		});
	}
}
