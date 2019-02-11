import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { UsuarioService } from "../../core/services/shared/usuario.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { Token } from "../../models/models.index";

declare var $: any;

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	userForm: FormGroup;
	public user: User;
	public telefonos: string[] = [];
	constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private router: Router) {
		this.user = new User();
	}

	myStyle: object = {};
    myParams: object = {};
    width: number = 100;
    height: number = 100;

	ngOnInit() {
		this.inituser();
		this.myStyle = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'z-index': -1,
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
        };

    this.myParams = {
            particles: {
                number: {
                    value: 100,
                },
                color: {
                    value: '#397EF5'
                },
                shape: {
					type: 'circle'
                },
        }
    };
	}

	inituser() {
		this.userForm = this.formBuilder.group({
			user: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
			password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(25)])
		});
	}

	login() {
		this.getDatoUser();
		this.user.getUserInfo = false;

		this.usuarioService.login(this.user).subscribe(res => {
			const token: Token = res;
			localStorage.setItem("token", token.token);
			this.user.getUserInfo = true;
			this.usuarioService.login(this.user).subscribe(resuser => {
				this.usuarioService.identity = resuser;
				localStorage.setItem("identity", JSON.stringify(resuser));
				this.router.navigate(["/dashboard"]);
			});
		});
	}

	getDatoUser() {
		this.user.userName = this.userForm.value.user;
		this.user.password = this.userForm.value.password;
	}

	createUser() {
		this.router.navigate(["/register"]);
	}

	forgotPassword() {}
}
