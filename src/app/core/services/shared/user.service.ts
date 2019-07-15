import {Injectable} from "@angular/core";
import {Global} from "./global";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../../models/User";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: "root"
})
export class UserService {
	public urlAuth: string;
	public url: string;
	public identity: User;
	public userUrl = "users";

	constructor(private http: HttpClient, private logger: NGXLogger) {
		this.urlAuth = Global.urlAuth;
		this.url = Global.url;
	}

	login(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "login", usuario, options);
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

	getUsers() {
		return this.http.get<User[]>(this.urlAuth + this.userUrl).pipe(map(data => data));
	}

	createUser(usuario: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "signup", usuario, options);
	}

	updateUser(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.put(this.urlAuth + this.userUrl, usuario);
	}

	verifyEmail(token) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "verifyemail/" + token, options);
	}

	filterUsersByRol(users: User[], rol) {
		return users.filter(user => user.role && user.role.name === rol);
	}
}
