import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EventModal } from "../../models/interface/EventModal";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { Router } from "@angular/router";
import { ModalService } from "../../core/services/shared/modal.service";

@Component({
	selector: "app-add-groups",
	templateUrl: "./add-groups.component.html",
	styleUrls: ["./add-groups.component.scss"]
})
export class AddGroupsComponent implements OnInit, OnDestroy, EventModal {
	@ViewChild("modalAddGroup") modalAddGroup: ModalDirective;

	ngUnsubscribe = new Subject<void>();
	group: GroupGame = new GroupGame();
	formAddGroup: FormGroup;
	disableButton = false;
	initialInvertion: number;

	constructor(
		private groupsService: GroupService,
		private formBuilder: FormBuilder,
		private router: Router,
		private toastService: ToastService,
		private modalService: ModalService
	) {}

	ngOnInit() {
		this.initFormGroup();
		this.subscribeEventModal();
	}

	initFormGroup() {
		this.formAddGroup = this.formBuilder.group({
			initialInvertion: new FormControl(0)
		});
	}

	createGroup() {
		this.disableButton = true;
		this.getValues();

		if (this.groupIsValid()) {
			this.groupsService
				.createGroup(this.initialInvertion)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe(
					() => {
						this.modalAddGroup.hide();
						const options = { toastClass: "opacity" };
						this.toastService.success("El grupo ha sido creado!", "Grupo", options);
						this.router.navigateByUrl("/groups");
					},
					() => {
						this.disableButton = false;
					},
					() => {
						this.disableButton = false;
					}
				);
		} else {
			this.disableButton = false;
		}
	}

	getValues() {
		this.initialInvertion = this.formAddGroup.value.initialInvertion;
	}

	groupIsValid(): boolean {
		if (this.initialInvertion <= 0) {
			this.modalService.showModalInfo("El monto debe ser mayor a cero!");
			return false;
		}

		if (this.initialInvertion >= 100000) {
			this.modalService.showModalInfo("El monto debe ser menor a 100,000$");
			return false;
		}

		return true;
	}

	subscribeEventModal() {
		this.groupsService.modalEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(showModal => {
			if (showModal) {
				this.formAddGroup.reset();
				this.modalAddGroup.show();
			} else {
				this.modalAddGroup.hide();
			}
		});
	}

	resetAndHideModal() {
		this.formAddGroup.reset();
		this.modalAddGroup.hide();
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
