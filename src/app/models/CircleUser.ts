import {MemberGroup} from './MemberGroup';

export class CircleUser {
	public position: number;
	public status: string;
	public member: MemberGroup;
	public isUserLogged: boolean = false;

	public constructor() {}
}
