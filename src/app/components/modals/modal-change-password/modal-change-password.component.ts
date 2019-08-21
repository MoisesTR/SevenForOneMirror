import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-modal-change-password",
	templateUrl: "./modal-change-password.component.html",
	styleUrls: ["./modal-change-password.component.scss"]
})
export class ModalChangePasswordComponent implements OnInit {
	constructor() {}

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	ngOnInit() {
		this.firstFormGroup = new FormGroup({
			password: new FormControl("", Validators.required)
		});
		this.secondFormGroup = new FormGroup({
			confirm: new FormControl("", Validators.required),
			newPassword: new FormControl("", Validators.required)
		});
	}

	get password() {
		return this.firstFormGroup.get("password");
	}
	get newPassword() {
		return this.secondFormGroup.get("newPassword");
	}
	get confirm() {
		return this.secondFormGroup.get("confirm");
	}

	onSubmit() {
		// do something here
	}
}
