import swal from "sweetalert2";
import * as moment from "moment";
import { environment } from "../../environments/environment";


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
      return mensaje.error[0].param + ' ' + mensaje.error[0].msg;
    }

		// MONGO ERROR
		if (mensaje.error.errmsg) {
			return mensaje.error.errmsg;
		}

		return undefined;
	}

	static showMsgInfo(mensaje: string, titulo = "Information") {
		swal.fire(titulo, mensaje, "info");
	}

	static showMsgError(mensaje: string, titulo = "Error") {
		swal.fire(titulo, mensaje, "error");
	}

	static showMsgSucces(mensaje: string, titulo = "Success") {
		swal.fire(titulo, mensaje, "success");
	}

	static formatDateYYYYMMDD(myDate) {

		return myDate ? moment(myDate).format("YYYY-MM-DD") : '';
	}

	static getYearDate(myDate) {
		return moment(myDate, "YYYY-MM-DD").year();
	}
}
