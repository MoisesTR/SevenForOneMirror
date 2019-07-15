import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/services/auth/auth.service";
import { Location } from "@angular/common";
import { MainSocketService } from "../../core/services/shared/main-socket.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-locked-screen",
	templateUrl: "./locked-screen.component.html",
	styleUrls: ["./locked-screen.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LockedScreenComponent implements OnInit {
	constructor(
		private authService: AuthService,
		private mainSocketService: MainSocketService,
		private location: Location,
		private router: Router
	) {}

	ngOnInit() {}

	close() {
		this.router.navigateByUrl("/landing-page");
	}

	stayHere() {
		this.mainSocketService.connect();
		this.location.back();
	}
}
