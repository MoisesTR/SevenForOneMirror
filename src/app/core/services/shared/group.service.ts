import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Global } from "./global";
import { Observable, Subject } from "rxjs";
import { GroupGame } from "../../../models/GroupGame";
import { MemberGroup } from "../../../models/MemberGroup";
import { Cacheable, CacheBuster } from "ngx-cacheable";

const cacheBuster$ = new Subject<void>();

@Injectable({
	providedIn: "root"
})
export class GroupService {
	public gameUrl = "game-groups/";

	public url: string;
	public modalEvent = new EventEmitter<any>();

	constructor(private http: HttpClient) {
		this.url = Global.url;
	}

	showModal() {
		this.modalEvent.emit(true);
	}

	@CacheBuster({
		cacheBusterNotifier: cacheBuster$
	})
	createGroup(initialInvertion: number): Observable<any> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		const options = { headers: headers };
		const body = JSON.stringify({ initialInvertion, uniqueChange: true });
		return this.http.post(this.url + this.gameUrl, body, options);
	}

	getGroup(groupId): Observable<any> {
		return this.http.get(this.url + this.gameUrl + groupId);
	}

	@Cacheable({
		cacheBusterObserver: cacheBuster$
	})
	getGroups(): Observable<GroupGame[]> {
		return this.http.get<GroupGame[]>(this.url + this.gameUrl);
	}

	getGroupsCurrentUser(userId): Observable<any> {
		return this.http.get(this.url + this.gameUrl + "current/" + userId);
	}

	addMemberToGroup(member: MemberGroup, groupId): Observable<any> {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };
		return this.http.post(this.url + this.gameUrl + "members/" + groupId, member, options);
	}

	removeMemberFromGroup(userId, groupId): Observable<any> {
		const params = new HttpParams().set("userId", userId);
		const options = { params: params };

		return this.http.delete(this.url + this.gameUrl + "members/" + groupId, options);
	}

	filterMemberByGroup(group: GroupGame, userId) {
		if (group) {
			let memberFiltered;
			const members = group.members;
			memberFiltered = members.find(member => member.userId === userId);

			return memberFiltered || undefined;
		} else {
			return null;
		}
	}

	getGroupsPlayingUser(groups: GroupGame[], userId) {
		const groupsPlayingUser: GroupGame[] = [];
		groups.forEach((group: GroupGame) => {
			const groupPlaying = new GroupGame();

			group.members.forEach((member: MemberGroup) => {
				if (member.userId === userId) {
					groupPlaying._id = group._id;
					groupPlaying.initialInvertion = group.initialInvertion;
					groupPlaying.timesPlayUser += 1;
				}
			});

			groupsPlayingUser.push(groupPlaying);
		});

		return groupsPlayingUser;
	}

	refund(authorizationID) {
		const headers = new HttpHeaders({
			"Content-Type": "application/json"
		});
		const options = { headers: headers };
		const body = JSON.stringify({ authorizationID: authorizationID });

		return this.http.post(this.url + "capture-authorization", body, options);
	}
}
