import { Injectable } from "@angular/core";
import { Global } from "./global";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../../../models/models.index";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class UsuarioService {
	public url: string;
	public identity: User;

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	login(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.url + "login", usuario, options);
	}

	loginGoogle(usuario: User) : Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    return this.http.post(this.url + "loginGoogle", usuario, options);
  }

	getUsuarios() {
		return this.http.get<User[]>(this.url + "users").pipe(map(data => data));
	}

	createUsuario(usuario: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };

		return this.http.post(this.url + "signup", usuario, options);
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
