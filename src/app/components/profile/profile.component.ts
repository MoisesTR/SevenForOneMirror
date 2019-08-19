import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth/auth.service";
import { User } from "../../models/User";
import { UserService } from "../../core/services/shared/user.service";
import { CustomValidators } from "../../validators/CustomValidators";
import { Utils } from "../../shared-module/Utils";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ModalService } from "../../core/services/shared/modal.service";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
	public user: User;
	public userUpdate: User;
	updateFormGroup: FormGroup;
	public phones: string[] = [];
	optionsGender = [{ value: "1", label: "Masculino" }, { value: "2", label: "Femenino" }];
	ngUnsubscribe = new Subject<void>();
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private modalService: ModalService,
		private formBuilder: FormBuilder,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.initFormUpdate();
		this.user = this.authService.getUser();
		this.userUpdate = new User();
		this.setValueUser();
	}

	initFormUpdate() {
		this.updateFormGroup = this.formBuilder.group({
			userName: new FormControl("", []),
			firstName: new FormControl("", [Validators.minLength(3), Validators.maxLength(150)]),
			lastName: new FormControl("", [Validators.minLength(3), Validators.maxLength(150)]),
			gender: new FormControl("", []),
			birthDate: new FormControl("", [CustomValidators.birthDateUser]),
			email: new FormControl("", []),
			phone: new FormControl("", [Validators.minLength(7), Validators.maxLength(25)]),
			password: new FormControl("", []),
			passwordConfirm: new FormControl("", [])
		});
	}

	setValueUser() {
		this.updateFormGroup.controls["userName"].setValue(this.user.userName);
		this.updateFormGroup.controls["firstName"].setValue(this.user.firstName);
		this.updateFormGroup.controls["lastName"].setValue(this.user.lastName);
		this.updateFormGroup.controls["gender"].setValue(this.getGender());
		this.updateFormGroup.controls["birthDate"].setValue(this.user.birthDate);
		this.updateFormGroup.controls["email"].setValue(this.user.email);
		this.updateFormGroup.controls["phone"].setValue(this.user.phones ? this.user.phones[0] : "");

		this.disableInputs();
	}

	getGender() {
		if (this.user.gender === "M") return "1";

		if (this.user.gender === "F") return "2";

		if (!this.user.gender) return undefined;
	}

	updateUser() {
		this.getValuesForm();

		this.userService
			.updateUser(this.userUpdate)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(resp => {
				this.cdr.markForCheck();
				this.modalService.showModalSuccess("Los datos han sido actualizados!!");
			});
	}

	getValuesForm() {
		const firstName = this.updateFormGroup.value.firstName;
		const lastName = this.updateFormGroup.value.lastName;
		const gender = this.updateFormGroup.value.gender;
		const birthDate = this.updateFormGroup.value.birthDate;
		const phones = this.updateFormGroup.value.phone;

		this.userUpdate._id = this.user._id;

		if (firstName) {
			this.userUpdate.firstName = firstName;
		}

		if (lastName) {
			this.userUpdate.lastName = lastName;
		}

		if (gender) {
			this.userUpdate.gender = +gender === 1 ? "M" : "F";
		}

		if (birthDate) {
			this.userUpdate.birthDate = Utils.formatDateYYYYMMDD(birthDate);
		}

		if (phones) {
			this.phones.push(phones);
			this.userUpdate.phones = this.phones;
		}
	}

	disableInputs() {
		this.updateFormGroup.controls["email"].disable();
		this.updateFormGroup.controls["userName"].disable();
	}
}
