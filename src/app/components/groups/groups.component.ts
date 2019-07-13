import { Component, OnInit, ViewChild, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { GroupGame } from "../../models/GroupGame";
import { Router } from "@angular/router";
import { MemberGroup } from "../../models/MemberGroup";
import { User } from "../../models/User";
import { AuthService } from "../../core/services/auth/auth.service";
import { RoleEnum } from "../../enums/RoleEnum";
import { PurchaseService } from "../../core/services/shared/purchase.service";
import { UpdateMoneyService } from "../../core/services/shared/update-money.service";
import { Utils } from "../../infraestructura/Utils";
import { ModalDirective } from "ng-uikit-pro-standard";
import { IPayPalConfig } from "ngx-paypal";
import { Global } from "../../core/services/shared/global";
import swal from "sweetalert2";
import { environment } from "../../../environments/environment";
import { SocketGroupGameService } from "../../core/services/shared/socket-group-game.service";
import { EventEnum } from "../../enums/EventEnum";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-groups",
	templateUrl: "./groups.component.html",
	styleUrls: ["./groups.component.scss"],
	providers: [DatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush
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
		private router: Router,
		private datePipe: DatePipe,
		private socketGroupGame: SocketGroupGameService
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
			createOrderOnServer: data =>
				fetch(Global.url + "create-paypal-transaction", {
					method: "post",
					headers: {
						"content-type": "application/json",
						Authorization: `Bearer ${this.authService.getToken()}`
					},
					body: JSON.stringify({
						finalPrice: this.finalPrice
					})
				})
					.then(res => {
						return res.json();
					})
					.then(order => {
						if (!order.error) {
							return order.orderID;
						} else {
							Utils.showMsgError(order.error, "Paypal Transaction");
							throw new Error(order.error);
						}
					}),
			onApprove: (data, actions) => {
				// console.log("onApprove - transaction was approved, but not authorized", data, actions);

				actions.order.get().then(details => {
					// console.log("onApprove - you can get full order details inside onApprove: ", details);
				});
			},
			onClientAuthorization: data => {
				// console.log(
				// 	"onClientAuthorization - you should probably inform your server about completed transaction at this point",
				// 	data
				// );
				const member = new MemberGroup();
				member.payReference = data.id;
				this.groupService
					.addMemberToGroup(member, this.groupSelectedPayModal._id)
					.pipe(takeUntil(this.ngUnsubscribe))
					.subscribe(() => {
						swal.fire("Info", "The registration has been successful!", "success").then(() => {
							this.socketGroupGame.recentBuyTicketGroup = true;
							this.socketGroupGame.connect();
							this.socketGroupGame.send(EventEnum.JOIN_GROUP, "");

							this.updateMoneyService.update(true);

							this.router.navigate(["/game", this.groupSelectedPayModal._id]);
						});
					});
			},
			onCancel: (data, actions) => {
				// console.log("OnCancel", actions);
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

	validateMemberIsNotAlreadyRegistered(groupId) {
		this.groupService
			.getGroup(groupId)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(group => {
				const member = this.groupService.filterMemberByGroup(group, this.user._id);
				this.actionViewGroup(member, groupId);
			});
	}

	actionViewGroup(member, groupId) {
		if (!this.userIsAdmin) {
			if (member) {
				this.router.navigate(["/game", groupId]);
			} else {
				Utils.showMsgInfo("Necesitas comprar una entrada al grupo!");
			}
		} else {
			this.router.navigate(["/game", groupId]);
		}
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
