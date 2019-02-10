import * as moment from "moment";

export class Utils{

    static formatDateYYYYMMDD(myDate) {
		return moment(myDate).format("YYYY-MM-DD");
    }
    
    static getYearDate(myDate) {
		return moment(myDate, "YYYY-MM-DD").year();
	}
}