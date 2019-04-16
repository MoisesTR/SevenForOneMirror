import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../../../models/User";

@Injectable()
export class AuthService {
	public jwtHelper;
	constructor(private router: Router) {}

	public getToken(): string {
		return localStorage.getItem("token");
	}

	public getUser(): User {
    const identity = JSON.parse(localStorage.getItem("identity"));
	  return identity ? identity : null;
  }

	public isAuthenticated(): boolean {
		this.jwtHelper = new JwtHelperService();
		const token = localStorage.getItem("token");

		return token != null ? !this.jwtHelper.isTokenExpired(token) : false;
	}

	public logout(): void {
		localStorage.clear();
		this.router.navigate(["/login"]);
	}
}
