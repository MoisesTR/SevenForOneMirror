// CLASE UTILIZADA PARA DECLARACION DE CONSTANTES DEL PROYECTO

import { environment } from "../../../../environments/environment";

const apiEndpointAuth: string = environment.apiEndpointAuth;
const apiEndpoint: string = environment.apiEndpoint;

export const Global = {
	urlAuth: apiEndpointAuth,
  url: apiEndpoint
};
