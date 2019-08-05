import { NgModule } from "@angular/core";
import { MDBBootstrapModulesPro } from "ng-uikit-pro-standard";
import { ModalSuccessComponent } from "./modal-success/modal-success.component";
import { ModalInfoComponent } from "./modal-info/modal-info.component";
import { ModalWarningComponent } from "./modal-warning/modal-warning.component";
import { ModalErrorComponent } from "./modal-error/modal-error.component";

@NgModule({
	declarations: [ModalSuccessComponent, ModalInfoComponent, ModalWarningComponent, ModalErrorComponent],
	exports: [ModalSuccessComponent, ModalInfoComponent, ModalWarningComponent, ModalErrorComponent, MDBBootstrapModulesPro],
	imports: [MDBBootstrapModulesPro]
})
export class ModalsModule {}
