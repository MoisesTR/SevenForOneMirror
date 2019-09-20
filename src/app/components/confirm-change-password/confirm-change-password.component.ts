import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../validators/CustomValidators";
import { UserService } from "../../core/services/shared/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ToastService } from "ng-uikit-pro-standard";

@Component({
	selector: "app-confirm-change-password",
	templateUrl: "./confirm-change-password.component.html",
	styleUrls: ["./confirm-change-password.component.scss"]
})
export class ConfirmChangePasswordComponent implements OnInit {
	formChangePassword: FormGroup;
	ngUnsubscribe = new Subject<void>();
	@ViewChild("newPassword") inputNewPassword: ElementRef;
	@ViewChild("confirmPassword") inputConfirmPassword: ElementRef;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private toastService: ToastService) {}

	ngOnInit() {
		this.initFormGroup();
	}

	initFormGroup() {
		this.formChangePassword = this.formBuilder.group(
			{
				password: new FormControl("", [
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(25),
					CustomValidators.nospaceValidator
				]),

				confirmPassword: new FormControl("", [])
			},
			{
				validator: CustomValidators.passwordMatchValidator
			}
		);
	}

	updatePassword() {
		const password = this.formChangePassword.value.password;
		const confirmPassword = this.formChangePassword.value.confirmPassword;

		console.log(password);
		console.log(confirmPassword);

		// this.userService
		// 	.recoverPassword(password, confirmPassword)
		// 	.pipe(takeUntil(this.ngUnsubscribe))
		// 	.subscribe(resp => {});

		const options = { toastClass: "opacity" };
		this.toastService.success("La Contraseña ha sido reestablecida con exito, inicie sesion!", "Contraseña", options);
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
