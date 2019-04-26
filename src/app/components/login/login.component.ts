import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { UserService } from "../../core/services/shared/user.service";
import { Router } from "@angular/router";
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from "angular-6-social-login";
import { RolService } from "../../core/services/shared/rol.service";
import { RoleEnum } from "../enums/RoleEnum";
import {Global, socialPlatFormConst, validRoles} from '../../core/services/shared/global';
import {SocialPlatFormEnum} from '../enums/SocialPlatFormEnum';

declare var $: any;

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	userForm: FormGroup;
	public user: User;
	public roles: RoleEnum[] = [];
	public disabledButton = false;
	public idRolUser: string;

	constructor(
		private usuarioService: UserService,
		private formBuilder: FormBuilder,
		private router: Router,
		private rolService: RolService,
		private socialAuthService: AuthService
	) {
		this.user = new User();
	}

	myStyle: object = {};
	myParams: object = {};
	width: number = 100;
	height: number = 100;

	ngOnInit() {
		this.styleParticles();
		this.inituser();
		this.getRoles();
	}

	styleParticles() {
		this.myStyle = {
			position: "fixed",
			width: "100%",
			height: "100%",
			"z-index": -1,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		};

		this.myParams = {
			particles: {
				number: {
					value: 100
				},
				color: {
					value: "#397EF5"
				},
				shape: {
					type: "circle"
				}
			}
		};
	}

	getRoles() {
		this.rolService.getRoles().subscribe(roles => {
			this.idRolUser = this.rolService.filterIdRol(RoleEnum.User, roles);
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
			this.user.accessToken = socialPlatformProvider === SocialPlatFormEnum.Google ?  userData.idToken : userData.token;
			this.user.role._id = this.idRolUser;

			this.usuarioService.loginSocial(this.user, socialPlatformProvider).subscribe(response => {
				this.usuarioService.identity = response.user;
				localStorage.setItem("token", response.token);
				localStorage.setItem("identity", JSON.stringify(response.user));
				this.router.navigate(["/dashboard"]);
			});
		});
	}

	inituser() {
		this.userForm = this.formBuilder.group({
			user: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
			password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(25)])
		});
	}

	login() {
		this.getCredentialsUser();
		this.user.getUserInfo = false;
		this.disabledButton = true;

		this.usuarioService.login(this.user).subscribe(
			response => {
				const token = response.token;
				this.usuarioService.identity = response.user;
				localStorage.setItem("token", token);
				localStorage.setItem("identity", JSON.stringify(this.usuarioService.identity));
				this.router.navigate(["/dashboard"]);
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
		this.router.navigate(["/register"]);
	}

	forgotPassword() {}
}
