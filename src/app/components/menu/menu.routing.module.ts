import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ProfileComponent } from "../profile/profile.component";
import { GroupsComponent } from "../groups/groups.component";
import { GamecontainerComponent } from "../gamecontainer/gamecontainer.component";
import { TopPlayersComponent } from "../top-players/top-players.component";
import { InvoicesComponent } from "../invoices/invoices.component";
import { GroupListComponent } from "../group-list/group-list.component";

import { WinHistoryComponent } from "../win-history/win-history.component";
import { TopGlobalWinnersComponent } from "../top-global-winners/top-global-winners.component";
import { ValidateMemberGroupGuard } from "../../core/services/shared/validate-member-group.guard";
import { AdminGuard } from "../../core/services/shared/admin.guard";

const menuRoutes = [
	{ path: "dashboard", component: DashboardComponent, data: { titulo: "Dashboard" } },
	{ path: "profile", component: ProfileComponent, data: { titulo: "Profile" } },
	{ path: "groups", component: GroupsComponent, data: { titulo: "Groups" } },
	{
		path: "game/:idGroup",
		canActivate: [ValidateMemberGroupGuard],
		component: GamecontainerComponent,
		data: { titulo: "Game container" }
	},
	{ path: "top-players", component: TopPlayersComponent, data: { titulo: "Top Players" } },
	{ path: "invoices", component: InvoicesComponent, data: { titulo: "Invoices" } },
	{ path: "win-history", component: WinHistoryComponent, data: { titulo: "Win History User" } },
	{ path: "global-winners", component: TopGlobalWinnersComponent, data: { titulo: "Top Global Winners" } },
	{ path: "group-list", canActivate: [AdminGuard], component: GroupListComponent, data: { titulo: "Group List" } },
	{ path: "", redirectTo: "/dashboard", pathMatch: "full", data: { titulo: "Dashboard" } }
];

@NgModule({
	imports: [RouterModule.forChild(menuRoutes)],
	exports: [RouterModule]
})
export class MenuRoutingModule {}
