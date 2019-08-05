import { Role } from "./Role";

export class User {
	public _id: string;
	public firstName: string;
	public lastName: string;
	public userName: string;
	public email: string;
	public rolName: string;
	public secretToken: string;
	public isVerified: boolean;
	public role: Role = new Role();
	public passwordHash: string;
	public password: string;
	public passwordConfirm: string;
	public enabled: boolean;
	public createdAt: string;
	public updatedAt: string;
	public accessToken: string;
	public getUserInfo: boolean;
	public phones?: string[];
	public birthDate?: string;
	public gender?: string;
	public provider: string;
	public image?: string;
	public roleId?: string;

	constructor() {}
}
