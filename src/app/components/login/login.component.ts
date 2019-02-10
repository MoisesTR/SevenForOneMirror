import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { UsuarioService } from "../../core/services/shared/usuario.service";

declare var $: any;

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	userForm: FormGroup;
	public user: User;
	public telefonos: string[] = [];
	constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder) {
		this.user = new User();
	}

	ngOnInit() {
		$(document).ready(() => {
			$(".input100").each(function() {
				$(this).on("blur", function() {
					if (
						$(this)
							.val()
							.trim() !== ""
					) {
						$(this).addClass("has-val");
					} else {
						$(this).removeClass("has-val");
					}
				});
			});
		});
		this.inituser();
	}

	inituser() {
		this.userForm = this.formBuilder.group({
			user: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
			password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(25)])
		});
	}

	registrar() {}

	createUser() {
		this.getDatoUser();
		// this.user.firstName = "Moises";
		// this.user.lastName = "Trigueros";
		// this.user.gender = "Masculino";
		// this.user.userName = this.userForm.value.user;
		// this.user.password = this.userForm.value.password;
		// this.user.role = "5c5de2211d65b81ce0497480";
		// this.telefonos.push("2249274");
		// this.user.phones = this.telefonos;
		// this.user.birthDate = "1996-11-04";
		// this.user.email = "moisesakt@gmail.com";
        //
		// this.usuarioService.createUsuario(this.user).subscribe(
		// 	response => {
        // localStorage.setItem("username", this.user.userName);
		// 		console.log("El usuario ha sido registrado exitosamente");
		// 	},
		// 	error => {
		// 		console.log(error);
		// 	}
		// );
	}

	getDatoUser() {
		this.user.userName = this.userForm.value.user;
		this.user.password = this.userForm.value.password;
	}
}
