import {Error} from 'tslint/lib/error';

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(`${moduleName} ya ha sido importado. El modulo core solo debe ser importado en appmodule.`);
	}
}
