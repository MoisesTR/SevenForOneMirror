import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
	selector: "app-confirm-change-password",
	templateUrl: "./confirm-change-password.component.html",
	styleUrls: ["./confirm-change-password.component.scss"]
})
export class ConfirmChangePasswordComponent implements OnInit {
	formChangePassword: FormGroup;

	@ViewChild("newPassword") inputNewPassword: ElementRef;
	@ViewChild("confirmPassword") inputConfirmPassword: ElementRef;

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
		const newPassword = this.inputNewPassword.nativeElement;
		const confirmPassword = this.inputConfirmPassword.nativeElement;
		let valueInput;
		let iconEyeOpen;
		let iconEyeLinked;

		if (idTextField === "newPassword") {
			valueInput = newPassword;
			iconEyeOpen = document.getElementById("eye-open-1");
			iconEyeLinked = document.getElementById("eye-linked-1");
		} else if (idTextField === "confirmPassword") {
			valueInput = confirmPassword;
			iconEyeOpen = document.getElementById("eye-open-2");
			iconEyeLinked = document.getElementById("eye-linked-2");
		}

		const inputType = valueInput.type;

		if (inputType === "password") {
			valueInput.setAttribute("type", "text");
			iconEyeOpen.style.display = "none";
			iconEyeLinked.style.display = "block";
		} else {
			valueInput.setAttribute("type", "password");
			iconEyeOpen.style.display = "block";
			iconEyeLinked.style.display = "none";
		}
	}
}
