import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../../../models/User";
import { BodyToken } from "../../../models/BodyToken";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Global } from "../shared/global";
import { tap } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	public jwtHelper;
	cachedRequests: Array<HttpRequest<any>> = [];
	public urlAuth: string;

	constructor(private router: Router, private http: HttpClient, private logger: NGXLogger) {
		this.urlAuth = Global.urlAuth;
	}

	public collectFailedRequest(request): void {
		this.cachedRequests.push(request);
	}

	public retryFailedRequests(): void {
		// retry the requests. this method can
		// be called after the token is refreshed
	}

	public getBodyToken() {
		const bodyToken: BodyToken = JSON.parse(localStorage.getItem("bodyToken"));
		return bodyToken || new BodyToken();
	}

	getRefreshToken() {
		return this.getBodyToken().refreshToken;
	}

	public getUser(): User {
		const identity = JSON.parse(localStorage.getItem("identity"));
		return identity ? identity : null;
	}

	public isAuthenticated(): boolean {
		this.jwtHelper = new JwtHelperService();
		const token = this.getBodyToken().token;

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
				this.logger.info("Save body token from refresh token endpoint");
				this.setBodyToken(bodyToken);
			})
		);
	}

	setValuesLocalStorage(response) {
		const bodyToken = new BodyToken();

		bodyToken.token = response.token;
		bodyToken.refreshToken = response.refreshToken;
		bodyToken.expiration = response.expiration;

		localStorage.removeItem("bodyToken");
		localStorage.setItem("bodyToken", JSON.stringify(bodyToken));

		if (response.user) localStorage.setItem("identity", JSON.stringify(response.user));
	}

	setBodyToken(bodyToken: BodyToken) {
		localStorage.removeItem("bodyToken");
		localStorage.setItem("bodyToken", JSON.stringify(bodyToken));
	}

	public logout(): void {
		localStorage.clear();
		this.router.navigate(["/login"]);
	}
}
