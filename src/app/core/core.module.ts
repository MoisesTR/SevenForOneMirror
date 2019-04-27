import { NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { AuthService } from "./services/auth/auth.service";
import { AuthGuardService } from "./services/auth/auth-guard.service";
import { UserService } from "./services/shared/user.service";
import { LoginGuardService } from "./services/auth/login.guard.service";
import { HttpInterceptorService } from "./services/auth/http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SharedModule } from "../shared-module/shared.module";
import {GroupService} from './services/shared/group.service';
import {RolService} from './services/shared/rol.service';
import {PurchaseService} from './services/shared/purchase.service';
import {UpdateMoneyService} from './services/shared/update-money.service';
import {GameService} from './services/shared/game.service';

@NgModule({
	imports: [],
	exports: [SharedModule],
	declarations: [],
	providers: [
		AuthService,
		AuthGuardService,
		LoginGuardService,
		UserService,
    RolService,
    GroupService,
    PurchaseService,
    UpdateMoneyService,
    GameService,
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
