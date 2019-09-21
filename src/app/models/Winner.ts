import { GroupGame } from "./models.index";

export class Winner {
	public _id: string;
	public userName: string;
	public image: string;
	public winDate: string;
	public totalWon: string[];
	public lastWonDate: string;
	public wonTimes: number;
	public quantity: string[];
	public trophyImageSrc: string;
	public statusPayment: string;
	public paypalEmail?: string;

	public constructor() {}
}
