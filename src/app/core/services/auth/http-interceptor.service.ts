import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import {catchError, filter, switchMap, take, timeout} from "rxjs/operators";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { NGXLogger } from "ngx-logger";
import { Utils } from "../../../shared-module/Utils";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalService } from "../shared/modal.service";

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
		private spinner: NgxSpinnerService,
		private modalService: ModalService
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.auth.getToken()) {
			request = this.addToken(request, this.auth.getToken());
		}

		this.logger.debug(request.url);
		return next.handle(request).pipe(
		  timeout(25000),
			catchError(error => {
				let errorMessage;
				if (error instanceof HttpErrorResponse) {
					this.spinner.hide();

					if (error.status === 401 && this.auth.getToken() && !this.auth.isAuthenticated()) {
						return this.handle401Error(request, next);
					}

					errorMessage = Utils.msgError(error);

					this.modalService.showModalError(errorMessage);

					return throwError(errorMessage);
				} else {
					this.spinner.hide();

					if (error.name === 'TimeoutError') {
					  this.modalService.showModalError('La petición ha tardado demasiado tiempo en responder!!');
          }
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
