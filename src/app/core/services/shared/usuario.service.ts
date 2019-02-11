import { Injectable } from "@angular/core";
import { Global } from "./global";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { User } from "../../../models/models.index";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import swal from "sweetalert2";

@Injectable()
export class UsuarioService {
	public url: string;
	public identity: User;

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	login(usuario: User): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http.post(this.url + "login", usuario, options).pipe(catchError(this.handleError));
	}

	getUsuarios() {
		return this.http.get<User[]>(this.url + "users").pipe(
			map(data => data),
			catchError(this.handleError)
		);
	}

	createUsuario(usuario: User) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http.post(this.url + "signup", usuario, options).pipe(catchError(this.handleError));
	}

	verifyEmail(token, username) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json",
			Authorization: ""
		});
		const options = { headers: headers };

		return this.http
			.post(this.url + "verifyemail/" + token + "/" + username, options)
			.pipe(catchError(this.handleError));
	}

	private handleError(res: HttpErrorResponse | any) {
		console.error(res.error || res.body.error);
		swal.fire("Confirmation", res.error.message || "Server error", "error").then(() => {});
		return observableThrowError(res.error.message || "Server error");
	}
}
