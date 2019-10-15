import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../../models/User";
import { Token } from "../../../models/Token";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "../shared/global";
import { map, tap } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { CookieService } from "ngx-cookie-service";
import { Observable, throwError } from "rxjs";
import { RoleEnum } from "../../../enums/RoleEnum";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	public jwtHelper;
	public urlAuth: string;
	public JWT_REFRESH = "_RefreshToken";
	public JWT_ACCESS = "_AccessToken";

	constructor(
		private router: Router,
		private http: HttpClient,
		private logger: NGXLogger,
		private cookieService: CookieService,
		@Inject(PLATFORM_ID) private platformID: object
	) {
		this.urlAuth = Global.urlAuth;
	}

	login(user: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "login", user, options);
	}

	loginSocial(usuario: User, socialPlatformProvider): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + this.getUrlSocial(socialPlatformProvider), usuario, options);
	}

	private getUrlSocial(socialPlatformProvider) {
		return socialPlatformProvider === "google" ? "loginGoogle" : "loginFacebook";
	}

	verifyPassword(userId: string, password: string): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers };
		const body = JSON.stringify({ password });
		return this.http.post(this.urlAuth + "verifyPwd/" + userId, body, options);
	}

	changePassword(password: string, passwordConfirm: string, userId: string): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers };
		const body = {
			password,
			passwordConfirm
		};

		return this.http.put(this.urlAuth + "pwd/" + userId, body, options);
	}

	forgotPassword(email: string, userName?: string) {
		const body = {
			userName,
			email
		};

		return this.http.post(this.urlAuth + "forgotPasswd", body);
	}

	resetPassword(token: string, password: string, passwordConfirm: string): Observable<any> {
		const body = JSON.stringify({ password, passwordConfirm });
		return this.http.patch(this.urlAuth + "resetPasswd/" + token, body);
	}

	verifyEmail(token) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "verifyemail/" + token, options);
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
			this.router.navigate(["/login"]);
			throwError(e);
		}

		return identity ? identity : null;
	}

	public userIsAdmin() {
		if (this.getUser() && this.getUser().role) {
			return this.getUser().role.name === RoleEnum.Admin;
		} else {
			this.logger.info("ERROR GET ROLE USER");
			this.router.navigate(["/login"]);
		}
	}

	public isAuthenticated() {
		// if (isPlatformBrowser(this.platformID)) {
		// 	this.jwtHelper = new JwtHelperService();
		// 	const token = this.getToken();
		//
		// 	return token ? !this.jwtHelper.isTokenExpired(token) : false;
		// } else {
		// 	return false;
		// return this.me().pipe(
		// 	map(resp => {
		//     this.setCookieUser(resp);
		// 		return true;
		// 	})
		// );
		// return of(false);
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
		// this.cookieService.deleteAll();

		// this.cookieService.set("token", response.token);
		// this.cookieService.set("refreshToken", response.refreshToken);
		// this.cookieService.set("expiration", response.expiration);

		this.cookieService.set("identity", JSON.stringify(response.user));
	}

	setCookieUser(user: User) {
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

	me(): Observable<any> {
		return this.http.get(this.urlAuth + "me");
	}

	public logout(): void {
		this.logger.info("CLOSE SESSION FROM AUTH SERVICE");
		this.cookieService.deleteAll();
		this.http.get(this.urlAuth + "logout").subscribe(() => {
			this.router.navigate(["/login"]);
			this.cookieService.deleteAll();
		});
	}
}
