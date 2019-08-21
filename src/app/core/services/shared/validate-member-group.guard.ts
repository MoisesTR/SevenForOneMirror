import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { GroupService } from "./group.service";
import { User } from "../../../models/User";
import { RoleEnum } from "../../../enums/RoleEnum";
import { ModalService } from "./modal.service";

@Injectable({
	providedIn: "root"
})
export class ValidateMemberGroupGuard implements CanActivate {
	ngUnsubscribe = new Subject<void>();
	user: User;
	userIsAdmin = false;
	constructor(
		public auth: AuthService,
		private groupService: GroupService,
		private modalService: ModalService,
		public router: Router
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
		this.user = this.auth.getUser();
		this.userIsAdmin = this.user.role.name === RoleEnum.Admin;
		const idGroup = route.paramMap.get("idGroup");

		return this.validateMemberIsNotAlreadyRegistered(idGroup);
	}

	validateMemberIsNotAlreadyRegistered(groupId): Observable<boolean> {
		return this.groupService.getGroup(groupId).pipe(
			map(group => {
				const member = this.groupService.filterMemberByGroup(group, this.user._id);
				if (!this.userIsAdmin) {
					if (member) {
						return true;
					} else {
						this.router.navigateByUrl("/groups").then(() => {
							this.modalService.showModalInfo("Necesitas comprar una entrada al grupo!");
						});
						return false;
					}
				} else {
					return true;
				}
			})
		);
	}
}
