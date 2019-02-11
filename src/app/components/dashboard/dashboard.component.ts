import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	constructor(private usuarioService: UsuarioService) { }

	elements: any = [
		{ id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
		{ id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
		{ id: 3, first: 'Larry', last: 'the Bird', handle: '@twitter' },
	];

	headElements = ['ID', 'First', 'Last', 'Handle'];

	ngOnInit() {
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			console.log(usuarios);
		});
	}
}
