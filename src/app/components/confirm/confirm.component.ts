import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { UsuarioService } from "../../core/services/shared/usuario.service";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: ["./confirm.component.scss"]
})
export class ConfirmComponent implements OnInit {
	public title = "probando confirmacion";
	public token: string;

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.token = params["token"];
			const username = localStorage.getItem("username");
			this.usuarioService.verifyEmail(this.token, username).subscribe(
				response => {
					console.log("Todo marcha bien");
				},
				error => {
					console.log("Ha ocurrido un error");
				}
			);
		});
	}
}
