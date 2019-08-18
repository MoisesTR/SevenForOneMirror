import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../../core/services/auth/auth.service";
import { User } from "../../models/User";
import { SocialPlatFormEnum } from "../../enums/SocialPlatFormEnum";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
	public user: User;
	updateFormGroup: FormGroup;

	optionsGender = [{ value: "1", label: "Masculino" }, { value: "2", label: "Femenino" }];

	constructor(private authService: AuthService, private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.initFormUpdate();
		this.user = this.authService.getUser();
		this.setValueUser();
	}

	initFormUpdate() {
		this.updateFormGroup = this.formBuilder.group({
			userName: new FormControl("", []),
			firstName: new FormControl("", []),
			lastName: new FormControl("", []),
			gender: new FormControl("", []),
			birthDay: new FormControl("", []),
			email: new FormControl("", []),
			phone: new FormControl("", []),
			password: new FormControl("", []),
			passwordConfirm: new FormControl("", [])
		});
	}

	setValueUser() {
		this.updateFormGroup.controls["userName"].setValue(this.user.userName);
		this.updateFormGroup.controls["firstName"].setValue(this.user.firstName);
		this.updateFormGroup.controls["lastName"].setValue(this.user.lastName);
		this.updateFormGroup.controls["gender"].setValue(this.getGender());
		this.updateFormGroup.controls["birthDay"].setValue(this.user.birthDate);
		this.updateFormGroup.controls["email"].setValue(this.user.email);
		this.updateFormGroup.controls["phone"].setValue(this.user.phones ? this.user.phones[0] : "");

		this.disableInputs();
	}

	getGender() {
		if (this.user.gender === "M") return "1";

		if (this.user.gender === "F") return "2";

		if (!this.user.gender) return "3";
	}

	disableInputs() {
		this.updateFormGroup.controls["email"].disable();
		this.updateFormGroup.controls["userName"].disable();

		if (this.user.provider === SocialPlatFormEnum.Facebook || this.user.provider === SocialPlatFormEnum.Google) {
			this.updateFormGroup.controls["password"].disable();
			this.updateFormGroup.controls["passwordConfirm"].disable();
		}
	}
}
