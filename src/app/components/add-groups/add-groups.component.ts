import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Utils } from "../../infraestructura/Utils";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
	selector: "app-add-groups",
	templateUrl: "./add-groups.component.html",
	styleUrls: ["./add-groups.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGroupsComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();
  group: GroupGame = new GroupGame();
	formAddGroup: FormGroup;
	disableButton = false;

	constructor(private groupsService: GroupService, private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.initFormGroup();
	}

	initFormGroup() {
		this.formAddGroup = this.formBuilder.group({
			monto: new FormControl(0),
			description: new FormControl("", [Validators.minLength(4), Validators.maxLength(40)])
		});
	}

	createGroup() {
		this.disableButton = true;
		this.getValues();

		if (this.groupIsValid()) {
			this.groupsService.createGroup(this.group).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
				response => {
					Utils.showMsgSucces("El grupo ha sido creado");
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

	groupIsValid(): boolean {
		if (this.group.initialInvertion <= 0) {
			Utils.showMsgInfo("El monto debe ser mayor a cero!");
			return false;
		}

		return true;
	}

	getValues() {
		this.group.initialInvertion = this.formAddGroup.value.monto;
	}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
