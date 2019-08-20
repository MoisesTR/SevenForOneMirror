import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../../../models/User";
import { Token } from "../../../models/Token";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "../shared/global";
import { tap } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { CookieService } from "ngx-cookie-service";
import { throwError } from "rxjs";
import { RoleEnum } from "../../../enums/RoleEnum";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	public jwtHelper;
	public urlAuth: string;
	public JWT_REFRESH = "refreshToken";
	public JWT_ACCESS = "token";

	constructor(
		private router: Router,
		private http: HttpClient,
		private logger: NGXLogger,
		private cookieService: CookieService,
		@Inject(PLATFORM_ID) private platformID: object
	) {
		this.urlAuth = Global.urlAuth;
	}

	getToken() {
		return this.cookieService.get(this.JWT_ACCESS);
	}

	getRefreshToken() {
		return this.cookieService.get(this.JWT_REFRESH);
	}

	public getUser(): User {
		let identity;

		try {
			identity = JSON.parse(this.cookieService.get("identity"));
		} catch (e) {
			this.logger.info("MISTAKE FROM JSON PARSE IDENTITY, \n" + "PROBABLY SOMEONE DELETED THE KEY IN THE COOKIE");
			this.logout();
			throwError(e);
		}

		return identity ? identity : null;
	}

	public userIsAdmin() {
		if (this.getUser().role) {
			return this.getUser().role.name === RoleEnum.Admin;
		} else {
			this.logger.info("ERROR GET ROLE USER");
			this.logout();
		}
	}

	public isAuthenticated(): boolean {
		if (isPlatformBrowser(this.platformID)) {
			this.jwtHelper = new JwtHelperService();
			const token = this.getToken();

			return token ? !this.jwtHelper.isTokenExpired(token) : false;
		} else {
			return false;
		}
	}

	refreshToken() {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const refreshToken = this.getRefreshToken();
		const userName = this.getUser().userName;

		const body = JSON.stringify({ userName, refreshToken });
		return this.http.post(this.urlAuth + "refreshtoken", body, options).pipe(
			tap((bodyToken: Token) => {
				this.logger.info("SAVE BODY TOKEN IN LOCAL STORAGE");
				this.setTokenValues(bodyToken);
			})
		);
	}

	setValuesCookies(response) {
		this.cookieService.deleteAll();

		this.cookieService.set("token", response.token);
		this.cookieService.set("refreshToken", response.refreshToken);
		this.cookieService.set("expiration", response.expiration);

		this.cookieService.set("identity", JSON.stringify(response.user));
	}

	setCookieUSer(user: User) {
		this.cookieService.set("identity", JSON.stringify(user));
	}

	setTokenValues(bodyToken: Token) {
		this.cookieService.delete("token");
		this.cookieService.delete("refreshToken");
		this.cookieService.delete("expiration");

		this.cookieService.set("token", bodyToken.token);
		this.cookieService.set("refreshToken", bodyToken.refreshToken);
		this.cookieService.set("expiration", bodyToken.expiration);
	}

	public logout(): void {
		this.logger.info("CLOSE SESSION FROM AUTH SERVICE");
		this.cookieService.deleteAll();
		this.router.navigate(["/login"]);
	}
}
