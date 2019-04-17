import {MemberGroup} from './MemberGroup';

export class GroupGame {

    public _id: number;
    public totalMembers: number;
    public Name: string;
    public initialInvertion: number;
    public members: MemberGroup[];
    public winners: number;
    public totalInvested: number;
    public createAt: string;
    public updateAt: string;
    public enabled: boolean;

    public GroupGame() {}

}
