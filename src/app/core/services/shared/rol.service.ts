import {Injectable} from '@angular/core';
import {Global} from './global';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Cacheable} from "ngx-cacheable";

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

  @Cacheable()
	getRoles(): Observable<any> {
		return this.http.get(this.url + this.urlRol);
	}

	filterIdRol(rolName, roles) {
		const rolFiltered = roles.find(rol => rol.name === rolName);

		return rolFiltered ? rolFiltered._id : null;
	}
}
