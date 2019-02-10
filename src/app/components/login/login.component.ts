import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { User } from "../../models/User";

declare var $: any;

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	userForm: FormGroup;
	public user: User;
	constructor(private formBuilder: FormBuilder) {
	  this.user = new User();
  }

	ngOnInit() {
		$(document).ready(() => {
			$(".input100").each(function() {
				$(this).on("blur", function() {
					if (
						$(this)
							.val()
							.trim() != ""
					) {
						$(this).addClass("has-val");
					} else {
						$(this).removeClass("has-val");
					}
				});
			});
		});
    this.inituser();
	}

	inituser() {
    this.userForm = this.formBuilder.group({
      'user': new FormControl('', [
        Validators.required
        , Validators.minLength(4)
         , Validators.maxLength(40)
      ])
      , 'password': new FormControl( '', [
          Validators.required
          , Validators.minLength(4)
          , Validators.maxLength(25)
        ]
      )
    });

  }

  registrar() {

  }

	getDatoUser() {
		this.user.UserName = this.userForm.value.user;
		this.user.Password = this.userForm.value.password;
	}
}
