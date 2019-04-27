import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

declare var $: any;

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
	updateFormGroup: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {
		$(document).ready(() => {
			$(".dropify").dropify();
		});

		this.initFormUpdate();
		this.getParams();
	}

	initFormUpdate() {
		this.updateFormGroup = this.formBuilder.group({
			user: new FormControl("", []),
			firstName: new FormControl("", []),
			lastName: new FormControl("", []),
			gender: new FormControl("", []),
			birthDay: new FormControl("", []),
			email: new FormControl("", []),
			password: new FormControl("", []),
			passwordConfirm: new FormControl("", [])
		});
	}

	getParams() {
	  this.updateFormGroup.controls['user'].setValue()
  }
}
