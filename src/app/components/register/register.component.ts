import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/models.index";
import { CustomValidators } from "../../validators/CustomValidators";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { Utils } from "../../infraestructura/Utils";

declare var $: any;

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
	public user: User;
	public telefonos: string[] = [];
	public disabledButton = false;
	public width: number = 100;
	public height: number = 100;

	formRegisterUser: FormGroup;

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private router: Router) {
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
			gender: new FormControl("", [Validators.required]),
			birthday: new FormControl("", [Validators.required])
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

				phone: new FormControl("", [Validators.required, Validators.minLength(7), Validators.maxLength(25)])
			},
			{
				validator: CustomValidators.passwordMatchValidator
			}
		);
	}

	getValuesForm() {
		// FIRST FORM
		this.user.userName = this.firstFormGroup.value.user;
		this.user.firstName = this.firstFormGroup.value.firstName;
		this.user.lastName = this.firstFormGroup.value.lastName;
		this.user.gender = this.firstFormGroup.value.gender;
		this.user.birthDate = Utils.formatDateYYYYMMDD(this.firstFormGroup.value.birthday);

		// SECOND FORM
		this.telefonos.push(this.secondFormGroup.value.phone);
		this.user.phones = this.telefonos;
		this.user.password = this.secondFormGroup.value.password;
		this.user.email = this.secondFormGroup.value.email;

		this.user.role = "5c5de2211d65b81ce0497480";
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

	keyPress(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
}
