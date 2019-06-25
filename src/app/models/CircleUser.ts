import {MemberGroup} from './MemberGroup';

/**-
 * Entity represent the circle used in the game group
 */
export class CircleUser {
	public position: number;
	public status: string;
	public member: MemberGroup;
	public isUserLogged = false;

	public constructor() {}
}
