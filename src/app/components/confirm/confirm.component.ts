import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../../core/services/shared/user.service';

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: ["./confirm.component.scss"]
})
export class ConfirmComponent implements OnInit {
	public verified = false;
	public tokenConfirmacion: string;
	private username = "";

	constructor(private activatedRoute: ActivatedRoute, private usuarioService: UserService, private router: Router) {}

	ngOnInit() {
		this.verifyTokenUser();
	}

	verifyTokenUser() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.tokenConfirmacion = params["token"];
			this.username = params["userName"];

      this.usuarioService.verifyEmail(this.tokenConfirmacion).subscribe(
        () => {
          this.verified = true;
        },
        () => {
          this.router.navigate(["/login"]);
        }
      );

		});
	}

	login() {
		this.router.navigate(["/login"]);
	}
}
