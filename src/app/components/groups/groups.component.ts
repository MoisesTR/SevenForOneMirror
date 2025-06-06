import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Router } from "@angular/router";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { IPayPalConfig } from "ngx-paypal";
import { environment } from "../../../environments/environment";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { PaypalService } from "../../core/services/shared/paypal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit, OnDestroy {
	@ViewChild("paymentModal") paymentModal: ModalDirective;
	ngUnsubscribe = new Subject<void>();

	public groups: Observable<GroupGame[]>;
	public user: User;
	public userIsAdmin = false;
	public groupSelectedPayModal: GroupGame;
	actualDate = new Date();
	public payPalConfig?: IPayPalConfig;
	private finalPrice = 0;

	constructor(
		private groupService: GroupService,
		private authService: AuthService,
		private purchaseService: PurchaseService,
		private updateMoneyService: UpdateMoneyService,
		private paypalService: PaypalService,
		private router: Router,
		private socketGroupGame: SocketGroupGameService,
		private ngZone: NgZone,
		private toast: ToastService,
		private spinnerService: NgxSpinnerService,
		private logger: NGXLogger
	) {
		this.groupSelectedPayModal = new GroupGame();
	}

	ngOnInit() {
		this.user = this.authService.getUser();
		this.userIsAdmin = this.user.role.name === RoleEnum.Admin;
		this.getGroups();
		this.initConfigPaypal();
	}

	getGroups() {
		this.groups = this.groupService.getGroups();
	}

	private initConfigPaypal(): void {
		this.payPalConfig = {
			clientId: environment.paypalClienttId,
			// for creating orders (transactions) on server see
			// https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
			createOrderOnServer: () =>
				this.paypalService
					.createPaypalTransaction(this.finalPrice, this.groupSelectedPayModal._id)
					.toPromise()
					.then(order => {
						this.logger.info("CREATE PAYPAL TRANSACTION", order.orderID);
						return order.orderID;
					}),
			onApprove: (data, actions) => {
				console.log("onApprove - transaction was approved, but not authorized", data, actions);
				actions.order.get().then(details => {
					console.log("onApprove - you can get full order details inside onApprove: ", details);
				});
			},
			// authorizeOnServer: approveData => {
			// 	return this.paypalService
			// 		.authorizeTransaction(approveData.orderID)
			// 		.toPromise()
			// 		.then(details => {
			// 			alert("Authorization created for " + details);
			// 		});
			// },
			onClientAuthorization: data => {
				this.logger.info(
					"onClientAuthorization - you should probably inform your server about completed transaction at this point",
					data
				);
				const member = new MemberGroup();
				member.payReference = data.id;
				this.groupService
					.addMemberToGroup(member, this.groupSelectedPayModal._id)
					.pipe(takeUntil(this.ngUnsubscribe))
					.subscribe(() => {
						this.paymentModal.hide();
						this.logger.info("SUCCESS MEMBER REGISTER DATABASE");

						this.socketGroupGame.connect();
						this.socketGroupGame.send(EventEnum.JOIN_GROUP, "");

						this.updateMoneyService.update(true);
						this.ngZone.run(() => this.router.navigateByUrl("/game/" + this.groupSelectedPayModal._id));

						const options = { toastClass: "opacity" };
						this.toast.success(
							"Te has registrado exitosamente en el grupo de " + this.groupSelectedPayModal.initialInvertion + " $",
							"Grupo",
							options
						);
					});
			},
			onCancel: (data, actions) => {
				// console.log("OnCancel", actions);
			},
			onError: err => {
				this.logger.error("ERROR PAYPAL CLIENT", err);
			},
			onClick: () => {
				// console.log("onClick");
			},
			advanced: {
				commit: "true"
			},
			style: {
				size: "medium",
				label: "paypal",
				layout: "vertical",
				color: "blue",
				shape: "pill"
			}
		};
	}

	gameContainer(groupId) {
		this.router.navigate(["/game", groupId]);
	}
	showPaymentModal(group: GroupGame) {
		this.groupSelectedPayModal = group;
		this.finalPrice = this.groupSelectedPayModal.initialInvertion;
		this.paymentModal.show();
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
