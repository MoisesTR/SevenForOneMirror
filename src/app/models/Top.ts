import { Winner } from "./Winner";

export class Top {
	public _id: string;
	public initialInvertion: number;
	public lastWinners: Winner[] = [];

	public constructor() {}
}
