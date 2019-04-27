import { Injectable } from "@angular/core";
import { MemberGroup } from "../../../models/MemberGroup";
import { CircleStatusEnum } from "../../../enums/CircleStatusEnum";
import { CircleUser } from "../../../models/CircleUser";
import { AuthService } from "../auth/auth.service";
import { User } from "../../../models/User";

@Injectable({
	providedIn: "root"
})
export class GameService {
	public userActual: User;
	constructor(private authService: AuthService) {
	  this.userActual = this.authService.getUser();
  }

	generateCirclesUser(cantCirculosVacios: number, members: MemberGroup[], winner: MemberGroup) {
		const circleUsers: CircleUser[] = [];
		cantCirculosVacios = members.length - (winner ? 1 : 0);
		if (winner) {
			const circleUser = this.createCircleUser(winner, 1);
			circleUsers.push(circleUser);
		}
		for (let i = 0; i < cantCirculosVacios; i++) {
			const circleUser = this.createCircleUser(null, circleUsers.length + 1);
			circleUsers.push(circleUser);
		}

		members.forEach((member, indexMember) => {
			const circleUser = this.createCircleUser(member, circleUsers.length + 1);
			circleUsers.push(circleUser);
		});


		return circleUsers;
	}

	createCircleUser(user: MemberGroup, position) {
		const circleUser = new CircleUser();
		circleUser.position = position;
		circleUser.status = CircleStatusEnum.Inactivo;

		if (user) {
			circleUser.status = CircleStatusEnum.Activo;
			circleUser.user = user;
			circleUser.isUserLogged = this.userActual._id === user._id;
		}

		return circleUser;
	}
}
