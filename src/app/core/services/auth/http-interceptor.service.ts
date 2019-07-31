import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { NGXLogger } from "ngx-logger";
import { Utils } from "../../../shared-module/Utils";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
	providedIn: "root"
})
export class HttpInterceptorService implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(
		public auth: AuthService,
		public router: Router,
		private logger: NGXLogger,
		private spinner: NgxSpinnerService
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.auth.getToken()) {
			request = this.addToken(request, this.auth.getToken());
		}

		this.logger.debug(request.url);
		return next.handle(request).pipe(
			catchError(error => {
				let errorMessage;
				if (error instanceof HttpErrorResponse) {
					this.spinner.hide();

					if (error.status === 401 && this.auth.getToken() && !this.auth.isAuthenticated()) {
						return this.handle401Error(request, next);
					}

					errorMessage = Utils.msgError(error)
						? Utils.msgError(error)
						: `Error Code: ${error.status}\nMessage: ${error.message}`;

					Utils.showMsgError(errorMessage, "Ha ocurrido un error interno durante la petición!");

					return throwError(errorMessage);
				} else {
					this.spinner.hide();
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
