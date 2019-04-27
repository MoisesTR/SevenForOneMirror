import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {UsersComponent} from '../users/users.component';
import {ProfileComponent} from '../profile/profile.component';
import {GroupsComponent} from '../groups/groups.component';
import {GamecontainerComponent} from '../gamecontainer/gamecontainer.component';

const menuRoutes = [
	{ path: "dashboard", component: DashboardComponent, data: { titulo: "Dashboard" } }
	, { path: "users", component: UsersComponent, data: { titulo: "Users" } }
	, { path: "profile/:userId", component: ProfileComponent, data: { titulo: "Profile" } }
	, { path: "groups", component: GroupsComponent, data: { titulo: "Groups" } }
	, { path: "", redirectTo: "/dashboard", pathMatch: "full", data: { titulo: "Dashboard" } }
	, { path: "game/:idGroup", component: GamecontainerComponent, data: { titulo: "game"}}
];

@NgModule({
	imports: [RouterModule.forChild(menuRoutes)],
	exports: [RouterModule]
})
export class MenuRoutingModule {}
