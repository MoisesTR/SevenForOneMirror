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

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ConfirmComponent,
		NotFound404Component,
		MenuComponent,
		NotFound404Component
	],
	imports: [BrowserModule, BrowserAnimationsModule, CoreModule, MDBBootstrapModulesPro.forRoot(), AppRoutingModule],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [MDBSpinningPreloader],
	bootstrap: [AppComponent]
})
export class AppModule {}
