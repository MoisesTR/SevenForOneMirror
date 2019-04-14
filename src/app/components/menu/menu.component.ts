import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Token, User } from "../../models/models.index";
declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
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

	ngOnInit() {
		this.getParams();

		$(document).ready(() => {
			$(".dropify").dropify();
		});

		function fixNavDropdown() {
			if ($(window).width() <= 575) {
				$(".navbar .dropdown-menu").removeClass("dropdown-menu-right");
			} else {
				$(".navbar .dropdown-menu").addClass("dropdown-menu-right");
			}
		}

		$(window).resize(function() {
			fixNavDropdown();
		});

		fixNavDropdown();
	}

	getUsuarios() {
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			this.usuarios = usuarios;
		});
	}

	getParams() {
		this.username = localStorage.getItem("username");
		this.password = localStorage.getItem("password");
		this.userActual = JSON.parse(localStorage.getItem("identity"));
		this.getUsuarios();
	}

	groups() {
		this.router.navigate(["/groups"]);
	}

	updateProfile() {
		this.router.navigate(["/profile"]);
	}

	logout() {
		localStorage.clear();
		this.usuarioService.identity = null;
		this.router.navigate(["/login"]);
	}
}
