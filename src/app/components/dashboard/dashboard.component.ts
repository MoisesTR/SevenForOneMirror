import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";

import { Token, User } from "../../models/models.index";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public token: Token;
	public user: User;
	public userActual: User;
	public usuarios: User[] = [];
	private username: string;
	private password: string;

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) {
		this.user = new User();
		this.token = new Token();
	}
	cards = [
		{
		  title: 'Category 1',
		  description: '10 dollar',
		  buttonText: 'Show',
		  img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
		},
		{
		  title: 'Category 2',
		  description: '20 dollar',
		  buttonText: 'Show',
		  img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
		},
		{
		  title: 'Category 3',
		  description: '30 dollar',
		  buttonText: 'Show',
		  img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
		},
		{
		  title: 'Category 4',
		  description: '40 dollar',
		  buttonText: 'Show',
		  img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
		}
	  ];
	  slides: any = [[]];
	  chunk(arr, chunkSize) {
		let R = [];
		for (let i = 0, len = arr.length; i < len; i += chunkSize) {
		  R.push(arr.slice(i, i + chunkSize));
		}
		return R;
	  }

	headElements = ["ID", "First", "Last", "Handle"];

	ngOnInit() {
		this.getParams();
		this.slides = this.chunk(this.cards, 3);
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
		this.username = localStorage.getItem("username");
		this.password = localStorage.getItem("password");
		this.userActual = JSON.parse(localStorage.getItem("identity"));
		this.getUsuarios();
	}
}
