import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/models.index";
import { Utils } from "../Utils";
import { CustomValidators } from "../../validators/CustomValidators";
import deepEqual from "deep-equal";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";

declare var $: any;

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
	public user: User;
	public telefonos: string[] = [];
	public compare: boolean;
	formRegisterUser: FormGroup;

	constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private router: Router) {
		this.user = new User();
	}

	colorSelect: Array<any>;
	myStyle: object = {};
	myParams: object = {};
	width: number = 100;
	height: number = 100;

	ngOnInit() {
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

		this.initFormRegisterUser();
	}

	private initFormRegisterUser() {
		this.formRegisterUser = this.formBuilder.group({
			user: new FormControl("", [
				Validators.required,
				Validators.minLength(4),
				Validators.maxLength(40),
				CustomValidators.nospaceValidator
			]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(25),
				CustomValidators.nospaceValidator
			]),

			confirmPassword: new FormControl("", [
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(25),
				CustomValidators.nospaceValidator
			]),

			email: new FormControl("", [Validators.required]),

			firstNames: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),

			lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),

			phone: new FormControl("", [Validators.required, Validators.minLength(7), Validators.maxLength(25)]),
			gender: new FormControl("", [Validators.required]),
			birthday: new FormControl("", [Validators.required])
		});
	}

	createdUser() {
		this.getValueForm();

		if (this.validateForm()) {
			this.usuarioService.createUsuario(this.user).subscribe(
				res => {
					localStorage.setItem("username", this.user.userName);
					localStorage.setItem("password", this.user.password);
					this.router.navigate(["/emailConfirm"]);
				},
				error => {
					swal.fire("Register", error, "error").then(() => {});
				}
			);
		}
	}

	getValueForm() {
		this.user.userName = this.formRegisterUser.value.user;
		this.user.password = this.formRegisterUser.value.password;
		this.user.firstName = this.formRegisterUser.value.firstNames;
		this.user.lastName = this.formRegisterUser.value.lastName;
		this.telefonos.push(this.formRegisterUser.value.phone);
		this.user.phones = this.telefonos;
		this.user.gender = this.formRegisterUser.value.gender;
		this.user.email = this.formRegisterUser.value.email;
		this.user.birthDate = Utils.formatDateYYYYMMDD(this.formRegisterUser.value.birthday);
		this.user.role = "5c5de2211d65b81ce0497480";
	}

	validateForm() {
		if (!this.compare) {
			swal.fire("Register", "Passwords do not match ", "error").then(() => {});
			return false;
		}
		this.user.password = this.formRegisterUser.value.password;
		return true;
	}

	createUser() {
		this.getValueForm();

		this.usuarioService.createUsuario(this.user).subscribe(
			res => {
				localStorage.setItem("username", this.user.userName);
				localStorage.setItem("password", this.user.password);
				swal.fire("Info", res["success"], "success").then(() => {
					this.router.navigate(["/emailConfirm"]);
				});
			},
			error => {
				swal.fire("Error", error, "error").then(() => {});
			}
		);
	}

	probarCambio(confirmPassword) {
		//devuelve true si es correcto
		this.compare = deepEqual(this.formRegisterUser.value.password, confirmPassword);
		return this.compare;
	}
}
