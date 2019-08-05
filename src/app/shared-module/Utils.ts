import {environment} from "../../environments/environment";

export class Utils {
	static msgError(mensaje) {
		if (!environment.production) {
			console.log(mensaje);
		}

		// HTTP ERROR RESPONSE
		if (mensaje.error.message) {
			return mensaje.error.message;
		}

		// VALIDATIONS API
		if (Array.isArray(mensaje.error)) {
			// return mensaje.error[0].param + ' ' + mensaje.error[0].msg;
			return mensaje.error[0].msg;
		}

		// MONGO ERROR
		if (mensaje.error.errmsg) {
			return mensaje.error.errmsg;
		}

		return undefined;
	}
}
