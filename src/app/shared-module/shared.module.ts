import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { ShowErrorsComponent} from "../components/show-errors.component";

@NgModule({
	imports: [],
	exports: [CommonModule, ReactiveFormsModule, FormsModule,
	DirectivesModule,
	ShowErrorsComponent	
],
	declarations: [ShowErrorsComponent]
})
export class SharedModule {}
