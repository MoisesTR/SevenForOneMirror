import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-email-confirm-recover-password",
	templateUrl: "./email-confirm-recover-password.component.html",
	styleUrls: ["./email-confirm-recover-password.component.scss"]
})
export class EmailConfirmRecoverPasswordComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {}

	login() {
		this.router.navigate(["/login"]);
	}
}
