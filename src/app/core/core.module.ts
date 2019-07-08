import { NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { HttpInterceptorService } from "./services/auth/http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SharedModule } from "../shared-module/shared.module";
import { CookieService } from "ngx-cookie-service";

@NgModule({
	imports: [],
	exports: [SharedModule],
	declarations: [],
	providers: [
		CookieService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpInterceptorService,
			multi: true
		}
	]
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, "CoreModule");
	}
}
