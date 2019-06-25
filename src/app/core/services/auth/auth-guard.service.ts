import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(public auth: AuthService, public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

	canActivate(): boolean {
		//verifica si esta en el lado del browser
		if (isPlatformBrowser(this.platformId)) {
			if (!this.auth.isAuthenticated()) {
				this.router.navigate(["/login"]);
				return false;
			}
			return true;
		}
	}
}
