import { Injectable } from "@angular/core";
import { Global } from "./global";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Role } from "../../../models/Role";

@Injectable({
	providedIn: "root"
})
export class RolService {
	public url: string;
	public urlRol = "roles";

	constructor(private http: HttpClient) {
		this.url = Global.urlAuth;
	}

	getRol(rolId): Observable<any> {
		return this.http.get(this.url + this.urlRol + "/" + rolId);
	}

	getRoles(): Observable<any> {
		return this.http.get(this.url + this.urlRol);
	}

	filterIdRolUser(roles: Role[]) {
		// Rol desginado para los usuarios normales
		const idRol = roles.find(rol => rol.name === "User")._id;
		return idRol ? idRol : '0';
	}
}
