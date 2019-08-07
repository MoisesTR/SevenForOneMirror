import { AbstractControl, FormControl } from "@angular/forms";
import { Utils } from "../shared-module/Utils";

export class CustomValidators {
	static nospaceValidator(control: AbstractControl): { [s: string]: boolean } {
		if (control.value && control.value.toString().trim().length === 0) {
			return { nospace: true };
		}
	}

	static birthDateUser(c: FormControl) {
		const yearOfDate = Utils.getYearOfDate(c.value);
		const yearActual = Utils.getYearOfDate(new Date());
		let error = "";

		if (yearActual - yearOfDate <= 18) {
			error = "El jugador no debe tener menos de 18 años!";
		} else {
			error = "";
		}

		const message = {
			birthDateUser: {
				message: error
			}
		};

		return error ? message : null;
	}

	static passwordMatchValidator(control: AbstractControl) {
		const password: string = control.get("password").value; // get password from our password form control
		const confirmPassword: string = control.get("confirmPassword").value; // get password from our confirmPassword form control

		// compare is the password math
		if (password !== confirmPassword) {
			// if they don't match, set an error in our confirmPassword form control
			control.get("confirmPassword").setErrors({ noPasswordMatch: true });
		}
	}
}
