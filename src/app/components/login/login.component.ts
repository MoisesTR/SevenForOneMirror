import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import {Token} from '../../models/models.index';

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
	constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private router: Router) {
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

	login() {
		this.getDatoUser();
		this.user.getUserInfo = false;

		this.usuarioService.login(this.user).subscribe(res => {
      const token: Token = res;
      localStorage.setItem("token", token.token);
			this.user.getUserInfo = true;
			this.usuarioService.login(this.user).subscribe(resuser => {
				this.usuarioService.identity = resuser;
				this.router.navigate(["/dashboard"]);
			});
		});
	}

	getDatoUser() {
		this.user.userName = this.userForm.value.user;
		this.user.password = this.userForm.value.password;
	}

	createUser() {
		this.router.navigate(["/register"]);
	}

	forgotPassword() {}
}
