import {Injectable} from '@angular/core';
import {MemberGroup} from '../../../models/MemberGroup';
import {CircleStatusEnum} from '../../../enums/CircleStatusEnum';
import {CircleUser} from '../../../models/CircleUser';
import {User} from '../../../models/User';

@Injectable({
	providedIn: "root"
})
export class GameService {
	public user: User;

	constructor() {}

	generateCircles(members: MemberGroup[], winner: MemberGroup, user: User) {
		this.user = user;
		let quantityCirclesEmpty = 7;
		const circleUsers: CircleUser[] = [];
		quantityCirclesEmpty = quantityCirclesEmpty - members.length - (winner ? 1 : 0);

		if (winner) {
			const circleUser = this.createCircle(winner, 1);
			circleUsers.push(circleUser);
		}

		for (let i = 0; i < quantityCirclesEmpty; i++) {
			const circleUser = this.createCircle(null, circleUsers.length + 1);
			circleUsers.push(circleUser);
		}

		members.forEach((member) => {
			const circleUser = this.createCircle(member, circleUsers.length + 1);
			circleUsers.push(circleUser);
		});

		return circleUsers;
	}

	createCircle(member: MemberGroup, position) {
		const circleUser = new CircleUser();
		circleUser.position = position;

		if (member) {
			circleUser.status = CircleStatusEnum.Active;
			circleUser.member = member;
			circleUser.isUserLogged = this.user._id === member.userId;
		} else {
			circleUser.member = new MemberGroup();
			circleUser.member.userName = 'Disponible';
			circleUser.status = CircleStatusEnum.Inactive;
		}

		return circleUser;
	}

	getCircleUserPlaying(circleUsers: CircleUser[]) {
		return circleUsers.filter(circleUser => circleUser.status === CircleStatusEnum.Active);
	}
}
