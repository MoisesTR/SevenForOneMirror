import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { EventEnum } from "../../../enums/EventEnum";
import { NameSpaceEnum } from "../../../enums/NameSpaceEnum";

@Injectable({
	providedIn: "root"
})
export class MainSocketService {
	private socket;

	constructor() {
		this.socket = socketIo(environment.apiEndpoint);
	}

	public send(evento: EventEnum, payload: string): void {
		this.socket.emit(event, payload);
	}

	public onMessage(): Observable<String> {
		return new Observable<String>(observer => {
			this.socket.on("message", (data: string) => observer.next(data));
		});
	}

	public onEvent(event: EventEnum): Observable<any> {
		return new Observable<EventEnum>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

	public getNameSpace(nameSpace: NameSpaceEnum) {
		return io(nameSpace);
	}
}
