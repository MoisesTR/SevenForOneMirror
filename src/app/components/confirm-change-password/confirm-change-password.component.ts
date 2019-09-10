import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
	selector: "app-confirm-change-password",
	templateUrl: "./confirm-change-password.component.html",
	styleUrls: ["./confirm-change-password.component.scss"]
})
export class ConfirmChangePasswordComponent implements OnInit {
	formChangePassword: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.initFormGroup();
	}

	initFormGroup() {
		this.formChangePassword = this.formBuilder.group({
			initialInvertion: new FormControl(0)
		});
	}

	showPassword(idTextField) {
		const inputType = (<HTMLInputElement>document.getElementById(idTextField)).type;
		const iconEyeOpen = document.getElementById("eye-open");
		const iconEyeLinked = document.getElementById("eye-linked");

		if (inputType === "password") {
			document.getElementById(idTextField).setAttribute("type", "text");
			iconEyeOpen.style.display = "none";
			iconEyeLinked.style.display = "block";
		} else {
			document.getElementById(idTextField).setAttribute("type", "password");
			iconEyeOpen.style.display = "block";
			iconEyeLinked.style.display = "none";
		}
	}
}
