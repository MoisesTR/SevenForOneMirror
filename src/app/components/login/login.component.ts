import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { UserService } from "../../core/services/shared/user.service";
import { Router } from "@angular/router";
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from "angular-6-social-login";
import { AuthService as AuthServiceUser } from "../../core/services/auth/auth.service";
import { RolService } from "../../core/services/shared/rol.service";
import { SocialPlatFormEnum } from "../../enums/SocialPlatFormEnum";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { isPlatformServer } from "@angular/common";
import { ModalService } from "../../core/services/shared/modal.service";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
	@ViewChild("forgotPassword") modalForgotPassword: ModalDirective;

	ngUnsubscribe = new Subject<void>();
	userForm: FormGroup;
	formRecoverPassword: FormGroup;
	public user: User;
	public disabledButton = false;
	public exact: boolean;

	public optionsToast = { toastClass: "opacity" };

	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private router: Router,
		private rolService: RolService,
		private toastService: ToastService,
		private socialAuthService: AuthService,
		private authService: AuthServiceUser,
		@Inject(PLATFORM_ID) private platformId: Object,
		private modalService: ModalService
	) {
		this.user = new User();
	}

	myStyle: object = {};
	myParams: object = {};
	width = 100;
	height = 100;

	ngOnInit() {
		this.initFormUser();
		this.initFormRecoverPassword();
	}

	initFormUser() {
		this.userForm = this.formBuilder.group({
			user: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
			password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(25)])
		});
	}

	initFormRecoverPassword() {
		this.formRecoverPassword = this.formBuilder.group({
			email: new FormControl(
				"",
				Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])
			)
		});
	}

	socialSignIn(socialPlatform: string) {
		let socialPlatformProvider;
		if (socialPlatform === SocialPlatFormEnum.Google) {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		}

		if (socialPlatform === SocialPlatFormEnum.Facebook) {
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
		}

		this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
			this.user.accessToken = socialPlatformProvider === SocialPlatFormEnum.Google ? userData.idToken : userData.token;

			this.authService
				.loginSocial(this.user, socialPlatformProvider)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(response => {
					this.authService.setCookieUser(response.user);
					this.router.navigateByUrl("/dashboard");
				});
		});
	}

	login() {
		this.getCredentialsUser();
		this.user.getUserInfo = false;
		this.disabledButton = true;

		this.authService
			.login(this.user)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				response => {
					this.disabledButton = false;
					this.authService.setCookieUser(response.user);
					this.router.navigateByUrl("/dashboard");
				},
				() => {
					this.disabledButton = false;
				}
			);
	}

	getCredentialsUser() {
		this.user.userName = this.userForm.value.user;
		this.user.password = this.userForm.value.password;
	}

	createUser() {
		if (isPlatformServer(this.platformId)) {
			this.exact = true;
			//this.router.navigateByUrl("/register")
		} else {
			this.router.navigate(["/register"]);
		}
	}

	openNav() {
		document.getElementById("myNav").style.width = "100%";
	}

	closeNav() {
		document.getElementById("myNav").style.width = "0%";
	}

	recoverPassword() {
		this.disabledButton = true;
		const email = this.formRecoverPassword.value.email;

		this.authService
			.forgotPassword(email)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				() => {
					this.disabledButton = false;
					this.modalForgotPassword.hide();
					this.router.navigateByUrl("/recover-account-message");
				},
				() => {
					this.disabledButton = false;
				}
			);
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
