import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../shared-module/shared.module";
import { MenuRoutingModule } from "./menu.routing.module";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { MDBBootstrapModulesPro } from "ng-uikit-pro-standard";
import { ProfileComponent } from "../profile/profile.component";
import { GroupsComponent } from "../groups/groups.component";
import { GameComponent } from "../game/game.component";
import { GamecontainerComponent } from "../gamecontainer/gamecontainer.component";
import { NgxPayPalModule } from "ngx-paypal";
import { TopPlayersComponent } from "../top-players/top-players.component";

import { InvoicesComponent } from "../invoices/invoices.component";
import { WinHistoryComponent } from "../win-history/win-history.component";
import { TopGlobalWinnersComponent } from "../top-global-winners/top-global-winners.component";

@NgModule({
	imports: [SharedModule, MenuRoutingModule, MDBBootstrapModulesPro, NgxPayPalModule],
	exports: [GameComponent],
	declarations: [
		DashboardComponent,
		ProfileComponent,
		GroupsComponent,
		GameComponent,
		GamecontainerComponent,
		TopPlayersComponent,
		InvoicesComponent,
		WinHistoryComponent,
		TopGlobalWinnersComponent
	],
	schemas: [NO_ERRORS_SCHEMA]
})
export class MenuModule {}
