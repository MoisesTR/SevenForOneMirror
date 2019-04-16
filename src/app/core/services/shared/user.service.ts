import { Injectable } from "@angular/core";
import { Global } from "./global";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from '../../../models/User';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class UserService {
	public url: string;
	public identity: User;
	public userUrl = "users";

	constructor(private http: HttpClient) {
		this.url = Global.urlAuth;
	}

	login(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.url + "login", usuario, options);
	}

	loginGoogle(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.url + "loginGoogle", usuario, options);
	}

	getUsers() {
		return this.http.get<User[]>(this.url + this.userUrl).pipe(map(data => data));
	}

	createUsuario(usuario: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.url + "signup", usuario, options);
	}

	updateUser(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.put(this.url + this.userUrl, usuario);
	}

	verifyEmail(token) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http.post(this.url + "verifyemail/" + token, options);
	}
}
