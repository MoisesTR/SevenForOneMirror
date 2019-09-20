import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { MenuComponent } from "./components/menu/menu.component";
import { NotFound404Component } from "./components/not-found404/not-found404.component";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { EmailConfirmComponent } from "./components/email-confirm/email-confirm.component";
import { AuthGuardService } from "./core/services/auth/auth-guard.service";
import { LockedScreenComponent } from "./components/locked-screen/locked-screen.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { ConfirmChangePasswordComponent } from "./components/confirm-change-password/confirm-change-password.component";
import { EmailConfirmRecoverPasswordComponent } from "./components/email-confirm-recover-password/email-confirm-recover-password.component";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "login",
		pathMatch: "full"
	},
	{
		path: "",
		component: MenuComponent,
		canActivate: [AuthGuardService],
		loadChildren: "./components/menu/menu.module#MenuModule",
		data: { titulo: "Menu" }
	},

	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "confirm/:token/:userName", component: ConfirmComponent, data: { titulo: "Confirm Email" } },
	{ path: "emailConfirm", component: EmailConfirmComponent },
	{ path: "locked-screen", component: LockedScreenComponent, data: { titulo: "locked screen" } },
	{ path: "landing-page", component: LandingPageComponent, data: { titulo: "Landing page" } },
	{
		path: "confirm-change-password",
		component: ConfirmChangePasswordComponent,
		data: { titulo: "Confirm change screen" }
	},
	{
		path: "recover-account-message",
		component: EmailConfirmRecoverPasswordComponent,
		data: { titulo: "Email confirm Recover Password" }
	},
	{
		path: "**",
		component: NotFound404Component,
		data: {
			titulo: "Not found"
		}
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
	declarations: []
})
export class AppRoutingModule {}
