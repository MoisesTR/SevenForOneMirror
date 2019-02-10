export class User {
	public _id: number;
	public firstName: string;
	public lastName: string;
	public userName: string;
	public email: string;
	public phones: string[];
	public birthDate: string;
	public gender: string;
	public secretToken: string;
	public isVerified: boolean;
	public role: string;
	public passwordHash: string;
	public password: string;
	public enabled: number;
	public createdAt: string;
	public updatedAt: string;
	public getUserInfo: boolean;

	constructor() {}
}
