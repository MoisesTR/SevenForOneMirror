import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from "../../core/services/shared/user.service";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: ["./confirm.component.scss"]
})
export class ConfirmComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public verified = false;
	public tokenConfirmacion: string;
	private username = "";

	constructor(
		private activatedRoute: ActivatedRoute,
		private usuarioService: UserService,
		private authService: AuthService,
		private router: Router,
		private logger: NGXLogger
	) {}

	ngOnInit() {
		this.verifyTokenUser();
	}

	verifyTokenUser() {
		this.logger.info("VERIFY TOKEN USER");
		this.activatedRoute.params
			.pipe(
				switchMap((params: Params) => this.verifyEmail(params)),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(
				() => {
					this.verified = true;
				},
				() => {
					this.router.navigateByUrl("/login");
				}
			);
	}

	verifyEmail(params: Params) {
		this.tokenConfirmacion = params["token"];
		this.username = params["username"];
		this.logger.info("VERIFY EMAIL", params);
		return this.authService.verifyEmail(this.tokenConfirmacion);
	}

	login() {
		this.router.navigateByUrl("/login");
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
