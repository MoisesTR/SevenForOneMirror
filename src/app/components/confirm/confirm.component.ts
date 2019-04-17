import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from "../../core/services/shared/user.service";
import { Token } from "../../models/models.index";
import {AuthService} from '../../core/services/auth/auth.service';

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

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UserService, private router: Router, private authService: AuthService) {
		this.token = new Token();
	}

	ngOnInit() {
		this.getParams();
		this.verificarUsuario();
	}

	getParams() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.tokenConfirmacion = params["token"];
			this.username = this.authService.getUser().userName;
		});
	}

	verificarUsuario() {
		this.usuarioService.verifyEmail(this.tokenConfirmacion).subscribe(
			() => {
				this.verified = true;
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
