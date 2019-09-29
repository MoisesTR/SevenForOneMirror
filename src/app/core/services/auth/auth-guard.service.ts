import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";
import { isPlatformBrowser } from "@angular/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class AuthGuardService implements CanActivate {
	constructor(public auth: AuthService, public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

	canActivate(): Observable<boolean> | boolean {
		//verifica si esta en el lado del browser
		if (isPlatformBrowser(this.platformId)) {
			return this.auth.me().pipe(
				map(() => {
					return true;
				})
			);
		}
	}
}
