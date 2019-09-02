import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../core/services/shared/user.service";
import { AuthService } from "../../../core/services/auth/auth.service";
import { User } from "../../../models/User";
import { MdbStepperComponent, ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { CustomValidators } from "../../../validators/CustomValidators";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-modal-change-password",
	templateUrl: "./modal-change-password.component.html",
	styleUrls: ["./modal-change-password.component.scss"]
})
export class ModalChangePasswordComponent implements OnInit, OnDestroy {
	private user: User;
	public checkingPassword = false;
	public updatingPassword = false;
	@ViewChild("modalChangePassword") modalChangePassword: ModalDirective;
	@ViewChild("stepper") stepper: MdbStepperComponent;
	ngUnsubscribe = new Subject<void>();
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(
		private userService: UserService,
		private authService: AuthService,
		private toastService: ToastService,
		private logger: NGXLogger,
		private formBuilder: FormBuilder
	) {
		this.user = this.authService.getUser();
	}

	ngOnInit() {
		this.firstFormGroup = this.formBuilder.group({
			checkPassword: new FormControl("", [
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(25),
				CustomValidators.nospaceValidator
			])
		});

		this.secondFormGroup = this.formBuilder.group(
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

		this.userService.modalChangePassword.pipe(takeUntil(this.ngUnsubscribe)).subscribe(showModal => {
			if (showModal) {
				this.stepper.resetAll();
				this.firstFormGroup.reset();
				this.secondFormGroup.reset();
				this.modalChangePassword.show();
			} else {
				this.modalChangePassword.hide();
			}
		});
	}

	stepUpdatePassword() {
		const password = this.firstFormGroup.value.checkPassword;
		this.logger.info("CHECKING ACTUAL PASSWORD");
		this.checkingPassword = true;
		this.userService
			.verifyPassword(this.user._id, password)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				() => {
					this.checkingPassword = false;
					this.stepper.next();
				},
				() => {
					this.checkingPassword = false;
				}
			);
	}

	onSubmit() {
		const password = this.secondFormGroup.value.password;
		const confirmPassword = this.secondFormGroup.value.confirmPassword;
		this.updatingPassword = true;
		this.userService
			.changePassword(password, confirmPassword, this.user._id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				() => {
					this.updatingPassword = false;
					const options = { toastClass: "opacity" };
					this.toastService.success("La contraseña ha sido actualizada!!", "Actualizar Contraseña", options);
					this.modalChangePassword.hide();
				},
				() => {
					this.updatingPassword = false;
				}
			);
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

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
