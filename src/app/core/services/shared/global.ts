// CLASE UTILIZADA PARA DECLARACION DE CONSTANTES DEL PROYECTO

import { environment } from "../../../../environments/environment";

const apiEndpoint: string = environment.apiEndpoint;

export const Global = {
	url: apiEndpoint
};
