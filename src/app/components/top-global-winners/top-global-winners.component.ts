import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TopService } from "../../core/services/shared/top.service";
import { Winner } from "../../models/Winner";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { Router } from "@angular/router";
import { ModalDirective } from "ng-uikit-pro-standard";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: "app-top-global-winners",
	templateUrl: "./top-global-winners.component.html",
	styleUrls: ["./top-global-winners.component.scss"]
})
export class TopGlobalWinnersComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public winners3: Winner[] = [];
	public winners7: Winner[] = [];
	public winners: Winner[] = [];
	public existsRecords = true;

	@ViewChild("topPlayers") topPlayers: ModalDirective;
	constructor(
		private topWinnersService: TopService,
		private logger: NGXLogger,
		private router: Router,
		private spinner: NgxSpinnerService
	) {}

	ngOnInit() {
		this.getTopWinners();
	}

	getTopWinners() {
		this.spinner.show();
		this.topWinnersService
			.getTop10WinnersByMount()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(winners => {
				this.winners = winners;

				this.winners.forEach((winner, index) => {
					if (index <= 2) {
						winner.trophyImageSrc = "/assets/images/" + `Grupo${index + 1}B.png`;

						this.winners3.push(winner);
					}
					if (index > 2) {
						this.winners7.push(winner);
					}
				});

				if (this.winners.length === 0) this.existsRecords = false;

				this.spinner.hide();
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
