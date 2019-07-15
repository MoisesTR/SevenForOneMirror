import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
	selector: "app-landing-page",
	templateUrl: "./landing-page.component.html",
	styleUrls: ["./landing-page.component.scss"]
})
export class LandingPageComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		// Set the date we're counting down to
		const countDownDate: any = new Date();
		countDownDate.setDate(countDownDate.getDate() + 30);

		// Update the count down every 1 second
		const x = setInterval(function() {
			// Get todays date and time
			const now = new Date().getTime();

			// Find the distance between now an the count down date
			const distance = Math.abs(countDownDate - now);

			// Time calculations for days, hours, minutes and seconds
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Display the result in the element with id="demo"
			document.getElementById("time-counter").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

			// If the count down is finished, write some text
			if (distance < 0) {
				clearInterval(x);
				document.getElementById("time-counter").innerHTML = "EXPIRED";
			}
		}, 1000);
	}
}
