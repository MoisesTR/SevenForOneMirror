import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { Token } from "../../models/models.index";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: ["./confirm.component.scss"]
})
export class ConfirmComponent implements OnInit {
	public verified = false;
	public tokenConfirmacion: string;
	public token: Token;
	private username = "";

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) {
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
		});
	}

	verificarUsuario() {
		this.usuarioService.verifyEmail(this.tokenConfirmacion).subscribe(
			() => {
				this.verified = true;
				localStorage.removeItem("username");
			},
			() => {
				this.router.navigate(["/login"]);
			}
		);
	}

	login() {
		this.router.navigate(["/login"]);
	}
}
