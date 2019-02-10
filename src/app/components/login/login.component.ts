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
	}

	getDatoUser() {
		this.user.userName = this.userForm.value.user;
		this.user.password = this.userForm.value.password;
	}
}
