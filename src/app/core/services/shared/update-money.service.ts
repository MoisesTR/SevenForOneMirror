import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class UpdateMoneyService {

	private updateMount: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public updateMount$ = this.updateMount.asObservable();
	constructor() {}

	update(update: boolean) {
    this.updateMount.next(update);
  }

}
