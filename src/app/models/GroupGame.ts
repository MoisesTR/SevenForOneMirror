import { MemberGroup } from "./MemberGroup";
import { CircleUser } from "./CircleUser";
import {UserWin} from "./interface/UserWin";

export class GroupGame {
	public _id: string;
	public totalMembers: number;
	public Name: string;
	public initialInvertion: number;
	public members: MemberGroup[];
	public winners: number;
	public totalInvested: number;
	public createAt: string;
	public updateAt: string;
	public enabled: boolean;
	public lastWinner?: MemberGroup;
	public circleUsers?: CircleUser[] = [];
	public circleUsersPlaying?: CircleUser[] = [];
	public timesPlayUser = 0;
	public dataUserWin: UserWin;

	public GroupGame() {}
}
