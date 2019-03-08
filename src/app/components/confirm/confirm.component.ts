import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { Token, User } from "../../models/models.index";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: ["./confirm.component.scss"]
})
export class ConfirmComponent implements OnInit {
	public title = "Confirmacion de Correo";
	public tokenConfirmacion: string;
	public token: Token;
	public user: User;
	private username: string;
	private password: string;

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) {
		this.user = new User();
		this.token = new Token();
	}

	ngOnInit() {
		this.getParams();
		this.verificarUsuario();
	}

	getParams() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.tokenConfirmacion = params["token"];
			this.username = localStorage.getItem("username");
			this.password = localStorage.getItem("password");
		});
	}

	verificarUsuario() {
		this.usuarioService.verifyEmail(this.tokenConfirmacion).subscribe(
			() => {
				this.user.userName = this.username;
				this.user.password = this.password;
				this.user.getUserInfo = false;

				this.usuarioService.login(this.user).subscribe(
					token => {
						this.token = token;
						localStorage.setItem("token", this.token.token);
						this.user.getUserInfo = true;

						this.usuarioService.login(this.user).subscribe(
							user => {
								this.usuarioService.identity = user;
								localStorage.setItem("identity", JSON.stringify(user));

								swal.fire("Confirmation", "Welcome to Seven for One, your email is verified!", "success").then(() => {
									localStorage.removeItem("username");
									localStorage.removeItem("password");
									this.router.navigate(["/dashboard"]);
								});
							},
							() => {
								this.router.navigate(["/login"]);
							}
						);
					},
					() => {
						this.router.navigate(["/login"]);
					}
				);
			},
			() => {
				this.router.navigate(["/login"]);
			}
		);
	}
}
