import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app-routing.module";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import {MDBBootstrapModulesPro, MDBSpinningPreloader} from 'ng-uikit-pro-standard';

@NgModule({
	declarations: [AppComponent, LoginComponent, RegisterComponent],
	imports: [BrowserModule, CoreModule, MDBBootstrapModulesPro.forRoot(), AppRoutingModule],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [MDBSpinningPreloader],
	bootstrap: [AppComponent]
})
export class AppModule {}
