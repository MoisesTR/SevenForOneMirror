import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { TopWinnersService } from "../../core/services/shared/top-winners.service";
import { Winner } from "../../models/Winner";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Top } from "../../models/Top";
import { NGXLogger } from "ngx-logger";
import { Router } from "@angular/router";
import {ModalDirective} from "ng-uikit-pro-standard";

@Component({
	selector: "app-top-global-winners",
	templateUrl: "./top-global-winners.component.html",
	styleUrls: ["./top-global-winners.component.scss"]
})
export class TopGlobalWinnersComponent implements OnInit, AfterViewInit, OnDestroy {

	ngUnsubscribe = new Subject<void>();
	public winners3: Winner[] = [];
	public winners7: Winner[] = [];
	public winners: Winner[] = [];
	public top: Top;
  @ViewChild("topPlayers") topPlayers: ModalDirective;
	constructor(private topWinnersService: TopWinnersService, private logger: NGXLogger, private router: Router) {}

	ngOnInit() {
		this.getTopWinners();
	}

	getTopWinners() {
		this.topWinnersService
			.getTop10ByGroupId("5d1840a7e8cb71841ac481fd", 10)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(top => {
				this.top = top[0];

				this.winners = Object.keys(this.top.lastWinners).map(index => {
					return this.top.lastWinners[index];
				});

				this.winners.forEach((value, index) => {
					if (index <= 2) {
						this.winners3.push(value);
					}

					if (index > 2) {
						this.winners7.push(value);
					}
				});
			});
	}

  ngAfterViewInit(): void {
    this.topPlayers.show();
  }

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
