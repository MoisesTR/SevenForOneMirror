import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Utils} from '../infraestructura/Utils';


export class CustomValidators {

  static fechaNacimientoTrabajador(c: FormControl) {
      const año = Utils.getYearDate(c.value);
      const añoActual = Utils.getYearDate(new Date());
      let error = '';

    if ( (añoActual - año) <= 18) {
        error = 'El trabajador no puede tener menos de 18 años';
    } else {
        error = '';
    }
    const message = {
        'fechaNacimientoTrabajador': {
            'message': error
        }
    };

  return error ? message : null;

  }

  static espaciosVacios(c: FormControl): ValidationErrors {
    const cadena = String(c.value).trim();

    const message = {
      'espaciosVacios': {
        'message': 'No se permiten espacios vacios'
      }
    };

    return cadena.length === 0 ? message : null;
  }

  static nospaceValidator(control: AbstractControl): { [s: string]: boolean } {
        if (control.value && control.value.toString().trim().length === 0) {
            return { nospace: true };
        }
  }

   static mayorFechaActual (c: FormControl): ValidationErrors {
      const fecha = c.value;
      let error = '';

      if ( fecha && Utils.formatDateYYYYMMDD(fecha) > Utils.formatDateYYYYMMDD(new Date())) {
           error = 'No puede ser mayor a la fecha Actual';
       } else {
           error = '';
      }

       const message = {
           'mayorFechaActual': {
               'message': error
           }
       };

       return error ? message : null;
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control

    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ noPasswordMatch: true });
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

}
