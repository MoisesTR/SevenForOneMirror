import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ProfileComponent} from '../profile/profile.component';
import {GroupsComponent} from '../groups/groups.component';
import {GamecontainerComponent} from '../gamecontainer/gamecontainer.component';
import {AddGroupsComponent} from '../add-groups/add-groups.component';

const menuRoutes = [
	{ path: "dashboard", component: DashboardComponent, data: { titulo: "Dashboard" } }
	, { path: "profile", component: ProfileComponent, data: { titulo: "Profile" } }
	, { path: "groups", component: GroupsComponent, data: { titulo: "Groups" } }
	, { path: "", redirectTo: "/dashboard", pathMatch: "full", data: { titulo: "Dashboard" } }
	, { path: "game/:idGroup", component: GamecontainerComponent, data: { titulo: "Game container"}}
	, { path: "add-group", component: AddGroupsComponent, data: { titulo: "Add Group" } }
];

@NgModule({
	imports: [RouterModule.forChild(menuRoutes)],
	exports: [RouterModule]
})
export class MenuRoutingModule {}
