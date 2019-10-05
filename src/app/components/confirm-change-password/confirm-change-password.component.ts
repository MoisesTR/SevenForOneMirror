import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../validators/CustomValidators";
import { UserService } from "../../core/services/shared/user.service";
import { map, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { ToastService } from "ng-uikit-pro-standard";
import { AuthService } from "../../core/services/auth/auth.service";
import { ActivatedRoute, Params, Router } from "@angular/router";

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

	public token: string;

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService,
		private route: ActivatedRoute,
		private toastService: ToastService,
		private router: Router,
		private authService: AuthService
	) {
		this.token = this.route.snapshot.paramMap.get("token");
	}

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

		this.authService
			.resetPassword(this.token, password, confirmPassword)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(resp => {
				this.authService.setCookieUser(resp.user);
				const options = { toastClass: "opacity" };
				this.toastService.success("La Contraseña ha sido reestablecida con exito!", "Contraseña", options);
				this.router.navigateByUrl("/dashboard");
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
