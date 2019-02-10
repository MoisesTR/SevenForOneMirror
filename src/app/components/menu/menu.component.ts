import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
	constructor(private router: Router, private usuarioService: UsuarioService) {}

	ngOnInit() {}

	logout() {
		localStorage.clear();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}
}
