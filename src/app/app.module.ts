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
import { ParticlesModule } from "angular-particle";
import { ComponentsComponent } from "./components/components.component";
import {
	AuthServiceConfig,
	FacebookLoginProvider,
	GoogleLoginProvider,
	SocialLoginModule
} from "angular-6-social-login";

// Configs
export function getAuthServiceConfigs() {
	const config = new AuthServiceConfig([
		{
			id: FacebookLoginProvider.PROVIDER_ID,
			provider: new FacebookLoginProvider("425265861601261")
		},
		{
			id: GoogleLoginProvider.PROVIDER_ID,
			provider: new GoogleLoginProvider("380320064033-9vbj0mhvke1meolivgcun4kesjiequq8.apps.googleusercontent.com")
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
		ComponentsComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: "serverApp" }),
		BrowserAnimationsModule,
		CoreModule,
		AppRoutingModule,
		MDBBootstrapModulesPro.forRoot(),
		SocialLoginModule,
		ParticlesModule
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [
		MDBSpinningPreloader,
		{
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
