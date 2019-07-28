// show-errors.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'show-errors',
  template: `
    <div *ngIf="shouldShowErrors()">
        <span class="error-message" style="left: 2.5rem;" *ngFor="let error of listOfErrors()">{{error}}</span>
    </div>
 `,
})
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'Este campo es requerido',
    'minlength': (params) => params.requiredLength + ' caracteres minimos',
    'maxlength': (params) => params.requiredLength + ' caracteres maximos',
   /* 'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,*/
    'pattern': (params) => 'The email is not valid',
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message,
    'noNumeros': (params) => params.message,
    'espaciosVacios': (params) => params.message,
    'mayorFechaActual': (params) => params.message,
    'fechaNacimientoTrabajador' : (params) => params.message,
    'telefonos' : (params) => params.message,
    'rango' : (params) => params.message,
    'nospace' : (params) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }

}
