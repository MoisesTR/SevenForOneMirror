import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
	selector: "app-not-found404",
	templateUrl: "./not-found404.component.html",
	styleUrls: ["./not-found404.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFound404Component implements OnInit {
	constructor() {}

	ngOnInit() {
		$(function() {
			function testAnim(x) {
				$(".js-last")
					.removeClass()
					.addClass(x + " last js-last slow animated")
					.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
						$(this).removeClass();
						$(this).addClass("js-last last sleep slow");

						setTimeout(function() {
							$("body")
								.find(".js-last")
								.addClass("awake");
						}, 800);
					});
			}

			setInterval(function() {
				testAnim("last js-last animated hinge");
			}, 2000);
		});
	}
}
