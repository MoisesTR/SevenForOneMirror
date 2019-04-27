import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../shared-module/shared.module";
import { MenuRoutingModule } from "./menu.routing.module";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { MDBBootstrapModulesPro } from "ng-uikit-pro-standard";
import { UsersComponent } from "../users/users.component";
import { ProfileComponent } from "../profile/profile.component";
import { GroupsComponent } from "../groups/groups.component";
import { GameComponent } from "../game/game.component";
import { GamecontainerComponent } from "../gamecontainer/gamecontainer.component";

@NgModule({
	imports: [SharedModule, MenuRoutingModule, MDBBootstrapModulesPro],
	exports: [MDBBootstrapModulesPro],
	declarations: [
		DashboardComponent,
		UsersComponent,
		ProfileComponent,
		GroupsComponent,
		GameComponent,
		GamecontainerComponent
	],
	schemas: [NO_ERRORS_SCHEMA]
})
export class MenuModule {}
