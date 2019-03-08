import swal from "sweetalert2";
import * as moment from "moment";
import { environment } from "../../environments/environment";

export class Utils {
	static msgError(mensaje) {
		if (!environment.production) {
			console.log(mensaje);
		}

		if (mensaje.error.errmsg) {
			return mensaje.error.errmsg;
		}

		if (mensaje.error.message) {
			return mensaje.error.message;
		}

		return undefined;
	}

	static showMsgInfo(mensaje: string, titulo = "Información") {
		swal.fire(titulo, mensaje, "info");
	}

	static showMsgError(mensaje: string, titulo = "Error") {
		swal.fire(titulo, mensaje, "error");
	}

	static showMsgSucces(mensaje: string, titulo = "Exitoso") {
		swal.fire(titulo, mensaje, "success");
	}

	static formatDateYYYYMMDD(myDate) {
		return moment(myDate).format("YYYY-MM-DD");
	}

	static getYearDate(myDate) {
		return moment(myDate, "YYYY-MM-DD").year();
	}
}
