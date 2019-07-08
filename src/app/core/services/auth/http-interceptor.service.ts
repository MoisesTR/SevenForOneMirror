import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { NGXLogger } from "ngx-logger";
import { BodyToken } from "../../../models/BodyToken";
import { Utils } from "../../../infraestructura/Utils";

@Injectable({
	providedIn: "root"
})
export class HttpInterceptorService implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(public auth: AuthService, public router: Router, private logger: NGXLogger) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const bodyToken: BodyToken = this.auth.getBodyToken();

		if (this.auth.isAuthenticated()) {
			request = this.addToken(request, bodyToken.token);
		}

		this.logger.debug(request.url);
		return next.handle(request).pipe(
			catchError(error => {
				let errorMessage;
				if (error instanceof HttpErrorResponse) {
					if (error.status === 401) {
						return this.handle401Error(request, next);
					}

					errorMessage = Utils.msgError(error)
						? Utils.msgError(error)
						: `Error Code: ${error.status}\nMessage: ${error.message}`;

          Utils.showMsgError(errorMessage, "An internal error ocurred during your request!");

          return throwError(errorMessage)

        } else {
					return throwError(error);
				}
			})
		);
	}

	private addToken(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);
			this.logger.info("HANDLE 401 ERROR NOT REFRESHING TOKEN");
			return this.auth.refreshToken().pipe(
				switchMap((bodyToken: any) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next(bodyToken.token);
					return next.handle(this.addToken(request, bodyToken.token));
				})
			);
		} else {
			this.logger.info("HANDLE 401 ERROR REFRESHING TOKEN");
			return this.refreshTokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(jwt => {
					return next.handle(this.addToken(request, jwt));
				})
			);
		}
	}
}
