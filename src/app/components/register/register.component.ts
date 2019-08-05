import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { CustomValidators } from "../../validators/CustomValidators";
import { UserService } from "../../core/services/shared/user.service";
import { Router } from "@angular/router";
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from "angular-6-social-login";
import { RolService } from "../../core/services/shared/rol.service";
import { Role } from "../../models/Role";
import { RoleEnum } from "../../enums/RoleEnum";
import { SocialPlatFormEnum } from "../../enums/SocialPlatFormEnum";
import { Subject } from "rxjs";
import { AuthService as AuthServiceUser } from "../../core/services/auth/auth.service";
import { take, takeUntil } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import * as dayjs from "dayjs";
import { ModalService } from "../../core/services/shared/modal.service";

declare var $: any;

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	public user: User;
	public phones: string[] = [];
	public roles: Role[];
	public disabledButton = false;
	public width = 100;
	public height = 100;
	public idRolUser: string;

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(
		private usuarioService: UserService,
		private rolService: RolService,
		private formBuilder: FormBuilder,
		private router: Router,
		private socialAuthService: AuthService,
		private authService: AuthServiceUser,
		private cookieService: CookieService,
		private modalService: ModalService
	) {
		this.user = new User();
	}

	ngOnInit() {
		$(document).ready(() => {
			$(".letras").keypress(function(key) {
				if (
					(key.charCode < 97 || key.charCode > 122) && // letras mayusculas
					(key.charCode < 65 || key.charCode > 90) && // letras minusculas
					key.charCode !== 241 && // ñ
					key.charCode !== 209 && // Ñ
					key.charCode !== 32 && // espacio
					key.charCode !== 225 && // á
					key.charCode !== 233 && // é
					key.charCode !== 237 && // í
					key.charCode !== 243 && // ó
					key.charCode !== 250 && // ú
					key.charCode !== 193 && // Á
					key.charCode !== 201 && // É
					key.charCode !== 205 && // Í
					key.charCode !== 211 && // Ó
					key.charCode !== 218 // Ú
				) {
					return false;
				}
			});
		});

		this.initFirstFormGroup();
		this.initSecondFormGroup();
		this.getRoles();
	}

	private initFirstFormGroup() {
		this.firstFormGroup = this.formBuilder.group({
			user: new FormControl("", [
				Validators.required,
				Validators.minLength(4),
				Validators.maxLength(40),
				CustomValidators.nospaceValidator
			]),
			firstName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
			lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
			gender: new FormControl(""),
			birthday: new FormControl("")
		});
	}

	private initSecondFormGroup() {
		this.secondFormGroup = this.formBuilder.group(
			{
				password: new FormControl("", [
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(25),
					CustomValidators.nospaceValidator
				]),

				confirmPassword: new FormControl("", []),

				email: new FormControl("", [Validators.required]),

				phone: new FormControl("", [Validators.minLength(7), Validators.maxLength(25)])
			},
			{
				validator: CustomValidators.passwordMatchValidator
			}
		);
	}

	getRoles() {
		this.rolService
			.getRoles()
			.pipe(
				take(1),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(roles => {
				this.roles = roles;
				this.idRolUser = this.rolService.filterIdRol(RoleEnum.User, this.roles);
			});
	}

	getValuesForm() {
		// FIRST FORM
		this.user.userName = this.firstFormGroup.value.user;
		this.user.firstName = this.firstFormGroup.value.firstName;
		this.user.lastName = this.firstFormGroup.value.lastName;

		const gender = this.firstFormGroup.value.gender;

		if (gender) {
			this.user.gender = +this.firstFormGroup.value.gender === 1 ? "M" : "F";
		}

		// SECOND FORM
		if (this.firstFormGroup.value.birthday) {
			this.user.birthDate = dayjs(this.firstFormGroup.value.birthday).format("YYYY-MM-DD");
		}

		if (this.secondFormGroup.value.phone) {
			this.phones = [];
			this.phones.push(this.secondFormGroup.value.phone);
		}

		this.user.phones = this.phones;
		this.user.password = this.secondFormGroup.value.password;
		this.user.passwordConfirm = this.secondFormGroup.value.confirmPassword;
		this.user.email = this.secondFormGroup.value.email;
		this.user.roleId = this.idRolUser;
	}

	createUser() {
		this.getValuesForm();
		this.disabledButton = true;

		this.usuarioService
			.createUser(this.user)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					this.disabledButton = false;
					this.cookieService.set("username", this.user.userName);

					this.modalService.showModalSuccess(res["success"]);
				},
				() => {
					this.disabledButton = false;
				}
			);
	}

	okEventSuccess(value) {
		if (value) {
			this.router.navigate(["/emailConfirm"]);
		}
	}

	login() {
		this.router.navigateByUrl("/login");
	}

	openNav() {
		document.getElementById("myNav").style.width = "100%";
	}

	closeNav() {
		document.getElementById("myNav").style.width = "0%";
	}

	keyPress(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	socialSignUp(socialPlatform: string) {
		let socialPlatformProvider;
		if (socialPlatform === SocialPlatFormEnum.Google) {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		}

		if (socialPlatform === SocialPlatFormEnum.Facebook) {
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
		}

		this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
			this.user.accessToken = socialPlatformProvider === SocialPlatFormEnum.Google ? userData.idToken : userData.token;
			this.user.roleId = this.idRolUser;

			this.usuarioService
				.loginSocial(this.user, socialPlatformProvider)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(response => {
					this.authService.setValuesCookies(response);
					this.router.navigateByUrl("/dashboard");
				});
		});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
