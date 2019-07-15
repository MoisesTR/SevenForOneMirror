import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app-routing.module";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from "ng-uikit-pro-standard";
import { MenuComponent } from "./components/menu/menu.component";
import { NotFound404Component } from "./components/not-found404/not-found404.component";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { EmailConfirmComponent } from "./components/email-confirm/email-confirm.component";
import {
	AuthServiceConfig,
	FacebookLoginProvider,
	GoogleLoginProvider,
	SocialLoginModule
} from "angular-6-social-login";
import { environment } from "../environments/environment";
import { MdbFileUploadModule } from "mdb-file-upload";
import { LockedScreenComponent } from "./components/locked-screen/locked-screen.component";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { AddGroupsComponent } from "./components/add-groups/add-groups.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { GlobalErrorHandlerService } from "./core/services/shared/global-error-handler.service";
import { ErrorHandler } from "protractor/built/exitCodes";

// Configs
export function getAuthServiceConfigs() {
	const config = new AuthServiceConfig([
		{
			id: FacebookLoginProvider.PROVIDER_ID,
			provider: new FacebookLoginProvider("425265861601261")
		},
		{
			id: GoogleLoginProvider.PROVIDER_ID,
			provider: new GoogleLoginProvider(environment.googleClientId)
		}
	]);
	return config;
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ConfirmComponent,
		NotFound404Component,
		MenuComponent,
		NotFound404Component,
		EmailConfirmComponent,
		LockedScreenComponent,
		AddGroupsComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: "serverApp" }),
		BrowserAnimationsModule,
		CoreModule,
		AppRoutingModule,
		MDBBootstrapModulesPro.forRoot(),
		SocialLoginModule,
		NgxSpinnerModule,
		LoggerModule.forRoot({
			level: !environment.production ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.OFF,
			httpResponseType: "json",
			serverLogLevel: NgxLoggerLevel.OFF
		}),
		MdbFileUploadModule
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [
		MDBSpinningPreloader,
		{
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
		},
		[GlobalErrorHandlerService, { provide: ErrorHandler, useClass: GlobalErrorHandlerService }]
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
