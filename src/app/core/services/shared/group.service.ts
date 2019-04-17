import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Global } from "./global";
import { Observable } from "rxjs";
import { GroupGame } from "../../../models/GroupGame";
import { MemberGroup } from "../../../models/MemberGroup";

@Injectable({
	providedIn: "root"
})
export class GroupService {
	public gameUrl = "game-groups";
	public purchaseUrl = "purchase-history";

	public url: string;
	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	createGroup(group: GroupGame): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };
		return this.http.post(this.url + this.gameUrl, options);
	}

	getGroup(groupId): Observable<any> {
		return this.http.get(this.url + this.gameUrl + "/" + groupId);
	}

	getGroups(): Observable<any> {
		return this.http.get(this.url + this.gameUrl);
	}

	addMemberToGroup(member: MemberGroup, groupId): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };
		return this.http.post(this.url + this.gameUrl + "/members/" + groupId, member, options);
	}

	removeMemberFromGroup(userId, groupId): Observable<any> {
		const params = new HttpParams().set("userId", userId);
		const options = { params: params };

		return this.http.delete(this.url + this.gameUrl + "/members/" + groupId, options);
	}

	filterMemberByGroup(group: GroupGame, userId) {
		if (group) {
			let memberFiltered;
			let members: MemberGroup[] = [];
			members = group.members;
			memberFiltered = members.find(member => member.userId === userId);

			return memberFiltered ? memberFiltered : null;
		} else {
			return null;
		}
	}
}
