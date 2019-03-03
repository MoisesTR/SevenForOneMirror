import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";

import { Token, User } from "../../models/models.index";
import { ActivatedRoute, Params, Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public tokenConfirmacion: string;
	public token: Token;
	public user: User;
	public usuarios: User[] = [];
	private username: string;
	private password: string;

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) {
		this.user = new User();
		this.token = new Token();
	}

	elements: any = [
		{ id: 1, first: "Mark", last: "Otto", handle: "@mdo" },
		{ id: 2, first: "Jacob", last: "Thornton", handle: "@fat" },
		{ id: 3, first: "Larry", last: "the Bird", handle: "@twitter" }
	];

	headElements = ["ID", "First", "Last", "Handle"];

	ngOnInit() {
		this.getParams();
	}

	getUsuarios() {
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			this.usuarios = usuarios;
		});
	}

	logout() {
		localStorage.clear();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}

	getParams() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.tokenConfirmacion = params["token"];
			this.username = localStorage.getItem("username");
			this.password = localStorage.getItem("password");

			if (params["token"]) {
				this.verificarUsuario();
			} else {
				this.getUsuarios();
			}
		});
	}

	verificarUsuario() {
		this.usuarioService.verifyEmail(this.tokenConfirmacion, this.username).subscribe(
			() => {
				this.user.userName = this.username;
				this.user.password = this.password;
				this.user.getUserInfo = false;
				this.usuarioService.login(this.user).subscribe(
					res => {
						this.token = res;
						localStorage.setItem("token", this.token.token);
						this.user.getUserInfo = true;
						this.usuarioService.login(this.user).subscribe(resuser => {
							this.usuarioService.identity = resuser;
							swal.fire("Confirmation", "Welcome to Seven for One, your email is verified!", "success").then(() => {
								this.getUsuarios();
							});
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
	}
}
