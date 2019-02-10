import {Injectable} from '@angular/core';
import {Global} from './global';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../../../models/models.index';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
	providedIn: "root"
})
export class UsuarioService {
	public url: string;

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	login(usuario: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '' });
    const options = { headers: headers };

    return this.http
      .post<Observable<any>>(this.url + 'signin', usuario, options)
      .pipe(catchError(this.handleError));
  }

	getUsuarios() {
		return this.http.get<User[]>(this.url + "users").pipe(
			map(data => data),
			catchError(this.handleError)
		);
	}

	createUsuario(usuario: User)  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '' });
    const options = { headers: headers };

    return this.http
      .post<Observable<any>>(this.url + 'signup', usuario, options)
      .pipe(catchError(this.handleError));
	}

	private handleError(res: HttpErrorResponse | any) {
		console.error(res.error || res.body.error);
		return observableThrowError(res.error || "Server error");
	}
}
