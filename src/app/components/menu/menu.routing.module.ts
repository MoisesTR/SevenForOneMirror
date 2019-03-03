import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";

const menuRoutes = [
	{ path: "dashboard", component: DashboardComponent, data: { titulo: "Dashboard" } },
  { path: "dashboard/:id", component: DashboardComponent, data: { titulo: "Dashboard" } },
	{ path: "", redirectTo: "/dashboard", pathMatch: "full", data: { titulo: "Dashboard" } }
];

@NgModule({
	imports: [RouterModule.forChild(menuRoutes)],
	exports: [RouterModule]
})
export class MenuRoutingModule {}
