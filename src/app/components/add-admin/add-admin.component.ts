import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EventModal } from "../../models/interface/EventModal";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/shared/user.service";
import { take, takeUntil } from "rxjs/operators";
import { ModalDirective } from "ng-uikit-pro-standard";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../validators/CustomValidators";
import { User } from "../../models/User";
import { RolService } from "../../core/services/shared/rol.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { ModalService } from "../../core/services/shared/modal.service";

declare var $: any;

@Component({
	selector: "app-add-admin",
	templateUrl: "./add-admin.component.html",
	styleUrls: ["./add-admin.component.scss"]
})
export class AddAdminComponent implements OnInit, EventModal, OnDestroy {
	ngUnsubscribe = new Subject<void>();
	@ViewChild("modalAdmin") modalAdmin: ModalDirective;
	public formAdmin: FormGroup;
	public admin: User = new User();
	public idRolAdmin: string;
	constructor(
		private userService: UserService,
		private rolService: RolService,
		private formBuilder: FormBuilder,
		private modalService: ModalService
	) {}

	ngOnInit() {
		$(document).ready(() => {
			$(".letras").keypress(function(key) {
				if (
					(key.charCode < 97 || key.charCode > 122) && // letras mayusculas
					(key.charCode < 65 || key.charCode > 90) && // letras minusculas
					key.charCode !== 241 && // ñ
					key.charCode !== 209 && // Ñ
					key.charCode !== 32 && // espacio
					key.charCode !== 225 && // á
					key.charCode !== 233 && // é
					key.charCode !== 237 && // í
					key.charCode !== 243 && // ó
					key.charCode !== 250 && // ú
					key.charCode !== 193 && // Á
					key.charCode !== 201 && // É
					key.charCode !== 205 && // Í
					key.charCode !== 211 && // Ó
					key.charCode !== 218 // Ú
				) {
					return false;
				}
			});
		});
		this.initFormAdmin();
		this.getRoles();
		this.subscribeEventModal();
	}

	initFormAdmin() {
		this.formAdmin = this.formBuilder.group(
			{
				userName: new FormControl("", [Validators.required, Validators.maxLength(40), Validators.minLength(4)]),
				firstName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
				lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
				email: new FormControl("", [Validators.required]),
				password: new FormControl("", [
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(25),
					CustomValidators.nospaceValidator
				]),
				confirmPassword: new FormControl("", [Validators.required])
			},
			{
				validator: CustomValidators.passwordMatchValidator
			}
		);
	}

	getRoles() {
		this.rolService
			.getRoles()
			.pipe(
				take(1),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(roles => {
				this.idRolAdmin = this.rolService.filterIdRol(RoleEnum.Admin, roles);
			});
	}

	subscribeEventModal() {
		this.userService.modalAdmin.pipe(takeUntil(this.ngUnsubscribe)).subscribe(showModal => {
			if (showModal) {
				this.formAdmin.reset();
				this.modalAdmin.show();
			} else {
				this.resetAndHideModal();
			}
		});
	}

	resetAndHideModal() {
		this.modalAdmin.hide();
		this.formAdmin.reset();
	}

	getValuesForm() {
		this.admin.userName = this.formAdmin.value.userName;
		this.admin.firstName = this.formAdmin.value.firstName;
		this.admin.lastName = this.formAdmin.value.lastName;
		this.admin.password = this.formAdmin.value.password;
		this.admin.email = this.formAdmin.value.email;
		this.admin.passwordConfirm = this.formAdmin.value.confirmPassword;
		this.admin.roleId = this.idRolAdmin;
	}

	createAdmin() {
		this.getValuesForm();

		this.userService
			.createAdmin(this.admin)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(resp => {
				this.modalService.showModalSuccess("El administrador " + this.admin.userName + " se ha creado correctamente!");
				this.resetAndHideModal();
			});
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
