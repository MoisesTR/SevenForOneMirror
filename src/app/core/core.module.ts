import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { ReactiveFormsModule } from "@angular/forms";
import { NG_SELECT_DEFAULT_CONFIG, NgSelectModule } from "@ng-select/ng-select";
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NativeDateTimeAdapter } from "ng-pick-datetime/date-time/adapter/native-date-time-adapter.class";
import { Platform } from "@angular/cdk/platform";
import { AuthService } from "./services/auth/auth.service";
import { AuthGuardService } from "./services/auth/auth-guard.service";
import { UsuarioService } from "./services/shared/usuario.service";
import { DirectivesModule } from "../directives/directives.module";
import { LoginGuardService } from "./services/auth/login.guard.service";
import {HttpInterceptorService} from './services/auth/http-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
	imports: [],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		DirectivesModule,
		NgSelectModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule
	],
	declarations: [],
	providers: [
		AuthService,
		AuthGuardService,
		LoginGuardService,
		UsuarioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
		{
			provide: NG_SELECT_DEFAULT_CONFIG,
			useValue: {
				notFoundText: "No se encontraron resultados"
			}
		},
		{ provide: OWL_DATE_TIME_LOCALE, useValue: "es" },
		{
			provide: DateTimeAdapter,
			useClass: NativeDateTimeAdapter,
			deps: [OWL_DATE_TIME_LOCALE, Platform]
		}
	]
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, "CoreModule");
	}
}
