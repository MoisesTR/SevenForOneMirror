import { Injectable } from "@angular/core";
import { MemberGroup } from "../../../models/MemberGroup";
import { CircleStatusEnum } from "../../../enums/CircleStatusEnum";
import { CircleUser } from "../../../models/CircleUser";
import { User } from "../../../models/User";

@Injectable({
	providedIn: "root"
})
export class GameService {
	public user: User;

	constructor() {}

	generateCirclesUser(members: MemberGroup[], winner: MemberGroup, user: User) {
		this.user = user;
		let cantCirculosVacios = 7;
		const circleUsers: CircleUser[] = [];
		cantCirculosVacios = cantCirculosVacios - members.length - (winner ? 1 : 0);

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

	createCircleUser(member: MemberGroup, position) {
		const circleUser = new CircleUser();
		circleUser.position = position;

		if (member) {
			circleUser.status = CircleStatusEnum.Activo;
			circleUser.member = member;
			circleUser.isUserLogged = this.user._id === member.userId;
		} else {
			circleUser.member = new MemberGroup();
			circleUser.status = CircleStatusEnum.Inactivo;
		}

		return circleUser;
	}

	getCircleUserPlaying(circleUsers: CircleUser[]) {
		return circleUsers.filter(circleUser => circleUser.status === CircleStatusEnum.Activo);
	}
}
