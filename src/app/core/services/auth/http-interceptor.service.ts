import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { Utils } from "../../../infraestructura/Utils";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: "root"
})
export class HttpInterceptorService implements HttpInterceptor {
	constructor(public auth: AuthService, public router: Router, private logger: NGXLogger) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${this.auth.getToken()}`
			}
		});

		this.logger.debug(request.url);
		return next.handle(request).pipe(
			tap(
				(response: HttpEvent<any>) => {},
				(err: any) => {
					let errorMessage = "";
					if (err instanceof HttpErrorResponse) {
						if (!(err.error instanceof ErrorEvent)) {
							// server-side error
							errorMessage = Utils.msgError(err)
								? Utils.msgError(err)
								: `Error Code: ${err.status}\nMessage: ${err.message}`;

							// if (err.status === 401) {
							// 	this.auth.logout();
							// }
						}

						Utils.showMsgError(errorMessage, "An internal error ocurred during your request!");

						return throwError(errorMessage);
					}
				},
				() => {}
			)
		);
	}
}
