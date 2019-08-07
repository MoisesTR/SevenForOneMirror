export class Utils {
	static msgError(message) {

		// HTTP ERROR RESPONSE
		if (message.error.message) {
			return message.error.message;
		}

		// VALIDATIONS API
		if (Array.isArray(message.error)) {
			// return mensaje.error[0].param + ' ' + mensaje.error[0].msg;
			return message.error[0].msg;
		}

		// MONGO ERROR
		if (message.error.errmsg) {
			// return mensaje.error.errmsg;
      return 'Ha ocurrido un error interno en la API';
		}


		return 'Ha ocurrido un error interno en la API.';
	}
}
