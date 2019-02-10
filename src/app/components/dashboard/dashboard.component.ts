import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	constructor(private usuarioService: UsuarioService) {}

	ngOnInit() {
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			console.log(usuarios);
		});
	}
}
