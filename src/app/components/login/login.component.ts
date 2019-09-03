import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
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

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	userForm: FormGroup;
	public user: User;
	public disabledButton = false;
	public exact: boolean;

	constructor(
		private usuarioService: UserService,
		private formBuilder: FormBuilder,
		private router: Router,
		private rolService: RolService,
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
	}

	initFormUser() {
		this.userForm = this.formBuilder.group({
			user: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
			password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(25)])
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

			this.usuarioService
				.loginSocial(this.user, socialPlatformProvider)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(response => {
					this.authService.setValuesCookies(response);
					this.router.navigateByUrl("/dashboard");
				});
		});
	}

	login() {
		this.getCredentialsUser();
		this.user.getUserInfo = false;
		this.disabledButton = true;

		this.usuarioService
			.login(this.user)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				response => {
					this.authService.setValuesCookies(response);
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

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
