import { EventEmitter, Injectable } from "@angular/core";
import { Global } from "./global";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../../../models/User";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class UserService {
	public urlAuth: string;
	public url: string;
	public identity: User;
	public userUrl = "users";
	public modalAdmin = new EventEmitter<any>();
	public modalChangePassword = new EventEmitter<any>();

	constructor(private http: HttpClient) {
		this.urlAuth = Global.urlAuth;
		this.url = Global.url;
	}

	showModalAdmin() {
		this.modalAdmin.emit(true);
	}

	showModalChangePassword() {
		this.modalChangePassword.emit(true);
	}

	getUsers() {
		return this.http.get<User[]>(this.url + this.userUrl).pipe(map(data => data));
	}

	createUser(usuario: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "signup", usuario, options);
	}

	createAdmin(admin: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.urlAuth + "admin", admin, options);
	}

	updateUser(user: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.put(this.url + this.userUrl + "/" + user._id, user, options);
	}

	changeStateUser(userId, enabled = false) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});

		const httpParams = new HttpParams().set("enabled", enabled ? "true" : "false");

		const options = { headers, params: httpParams };

		return this.http.delete(this.url + this.userUrl + "/" + userId, options);
	}

	updatePaypalEmail(userId: string, paypalEmail: string): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});

		const options = { headers };
		const body = JSON.stringify({ paypalEmail });
		return this.http.put(this.url + this.userUrl + "/paypalEmail/" + userId, body, options);
	}

	verifyPassword(userId: string, password: string): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers };
		const body = JSON.stringify({ password });
		return this.http.post(this.urlAuth + this.userUrl + "/verifyPwd/" + userId, body, options);
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

		return this.http.put(this.urlAuth + this.userUrl + "/pwd/" + userId, body, options);
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
