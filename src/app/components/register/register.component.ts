import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { CustomValidators } from "../../validators/CustomValidators";
import { UserService } from "../../core/services/shared/user.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { Utils } from "../../infraestructura/Utils";
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from 'angular-6-social-login';
import { RolService } from "../../core/services/shared/rol.service";
import { Role } from "../../models/Role";
import { RoleEnum } from "../enums/RoleEnum";
import {SocialPlatFormEnum} from '../enums/SocialPlatFormEnum';

declare var $: any;

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
	public user: User;
	public telefonos: string[] = [];
	public roles: Role[];
	public disabledButton = false;
	public width: number = 100;
	public height: number = 100;
	public idRolUser: string;
	public idRolAdmin: string;

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(
		private usuarioService: UserService,
		private rolService: RolService,
		private formBuilder: FormBuilder,
		private router: Router,
		private socialAuthService: AuthService
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
		this.rolService.getRoles().subscribe(roles => {
			this.roles = roles;
			this.idRolUser = this.rolService.filterIdRol(RoleEnum.User, this.roles);
			this.idRolAdmin = this.rolService.filterIdRol(RoleEnum.Admin, this.roles);
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
			this.user.birthDate = Utils.formatDateYYYYMMDD(this.firstFormGroup.value.birthday);
		}

		if (this.secondFormGroup.value.phone) {
			this.telefonos = [];
			this.telefonos.push(this.secondFormGroup.value.phone);
		}

		this.user.phones = this.telefonos;
		this.user.password = this.secondFormGroup.value.password;
		this.user.passwordConfirm = this.secondFormGroup.value.confirmPassword;
		this.user.email = this.secondFormGroup.value.email;

		// Validacion temporal para crear un usuario administrador unico
		if (this.user.userName === "Admin") {
			this.user.role._id = this.idRolAdmin;
		} else {
			this.user.role._id = this.idRolUser;
		}
	}

	createUser() {
		this.getValuesForm();
		this.disabledButton = true;

		this.usuarioService.createUsuario(this.user).subscribe(
			res => {
				this.disabledButton = false;
				localStorage.setItem("username", this.user.userName);

				swal.fire("Info", res["success"], "success").then(() => {
					this.router.navigate(["/emailConfirm"]);
				});
			},
			() => {
				this.disabledButton = false;
			}
		);
	}

	login() {
		this.router.navigate(["/login"]);
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
}
