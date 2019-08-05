import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class ModalService {
	public modalSucessEvent = new EventEmitter<any>();
  public modalErrorEvent = new EventEmitter<any>();
  public modalWarningEvent = new EventEmitter<any>();
  public modalInfoEvent = new EventEmitter<any>();
  public messageBody = '';

	constructor() {}

	showModalSuccess(msg: string) {
	  this.messageBody = msg;
		this.modalSucessEvent.emit(true);
	}

  showModalError(msg: string) {
    this.messageBody = msg;
    this.modalErrorEvent.emit(true);
  }

  showModalInfo(msg: string) {
    this.messageBody = msg;
    this.modalInfoEvent.emit(true);
  }

  showModalWarning(msg: string) {
    this.messageBody = msg;
    this.modalWarningEvent.emit(true);
  }
}
