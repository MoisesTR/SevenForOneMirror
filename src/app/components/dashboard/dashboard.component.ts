import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { User } from "../../models/models.index";
import { Router } from "@angular/router";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public usuarios: User[];
	public userActual: User;
	constructor(private usuarioService: UsuarioService, private router: Router) {}

	headElements = ["#", "First Name", "Last Name", "Email"];

	ngOnInit() {
	  this.userActual = JSON.parse(localStorage.getItem("identity"));
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			this.usuarios = usuarios;
		});
	}

	logout() {
		localStorage.clear();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}
}
