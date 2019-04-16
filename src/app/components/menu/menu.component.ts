import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Role, Token, User } from "../../models/models.index";
import { RolService } from "../../core/services/shared/rol.service";
declare var $: any;

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
	public token: Token;
	public userActual: User;
	public usuarios: User[] = [];
	private username: string;
	private password: string;
	private roles: Role[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private rolService: RolService,
		private usuarioService: UsuarioService,
		private router: Router
	) {
		this.token = new Token();
	}

	ngOnInit() {
		this.getCredentialsUser();
		this.getRoles();

		$(document).ready(() => {
			$(".dropify").dropify();

			$(document).scroll(function() {
				if ($(this).scrollTop() >= 20) {
					
					$('#return-to-top').fadeIn(200);
				} else {
					
					$('#return-to-top').fadeOut(200);
				}
			});
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

	getCredentialsUser() {
		this.username = localStorage.getItem("username");
		this.password = localStorage.getItem("password");
		this.userActual = JSON.parse(localStorage.getItem("identity"));
		this.getUsuarios();
	}

  getRoles() {
   this.rolService.getRoles().subscribe(
     response => {
       console.log(response);
     }
   );
  }

	getUsuarios() {
		this.usuarioService.getUsuarios().subscribe(usuarios => {
			this.usuarios = usuarios;
		});
	}

	groups() {
		this.router.navigate(["/groups"]);
	}

	dashBoard() {
		this.router.navigate(["/dashboard"]);
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
