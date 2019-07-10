import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../../../models/User";
import { BodyToken } from "../../../models/BodyToken";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Global } from "../shared/global";
import { tap } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { CookieService } from "ngx-cookie-service";
import { throwError } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	public jwtHelper;
	cachedRequests: Array<HttpRequest<any>> = [];
	public urlAuth: string;
	public JWT_REFRESH = "refreshToken";
	public JWT_ACCESS = "token";

	constructor(
		private router: Router,
		private http: HttpClient,
		private logger: NGXLogger,
		private cookieService: CookieService
	) {
		this.urlAuth = Global.urlAuth;
	}

	public collectFailedRequest(request): void {
		this.cachedRequests.push(request);
	}

	public retryFailedRequests(): void {
		// retry the requests. this method can
		// be called after the token is refreshed
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

	public isAuthenticated(): boolean {
		this.jwtHelper = new JwtHelperService();
		const token = this.getToken();

		return token ? !this.jwtHelper.isTokenExpired(token) : false;
	}

	refreshToken() {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const refreshToken = this.getRefreshToken();
		const user = this.getUser();

		const body = JSON.stringify({ user, refreshToken });
		return this.http.post(this.urlAuth + "refreshtoken", body, options).pipe(
			tap((bodyToken: BodyToken) => {
				this.logger.info("SAVE BODY TOKEN IN LOCAL STORAGE");
				this.setTokenValues(bodyToken);
			})
		);
	}

	setValuesCookies(response) {
		this.cookieService.set("token", response.token);
		this.cookieService.set("refreshToken", response.refreshToken);
		this.cookieService.set("expiration", response.expiration);

		if (response.user) this.cookieService.set("identity", JSON.stringify(response.user));
	}

	setTokenValues(bodyToken: BodyToken) {
		this.cookieService.set("token", bodyToken.token);
		this.cookieService.set("refreshToken", bodyToken.refreshToken);
		this.cookieService.set("expiration", bodyToken.expiration);
	}

	public logout(): void {
		this.cookieService.deleteAll();
		this.router.navigate(["/login"]);
	}
}
