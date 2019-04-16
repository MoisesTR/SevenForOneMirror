import { Component, OnInit } from "@angular/core";
import { GroupService } from "../../core/services/shared/group.service";
import { UserGame } from "../../models/UserGame";
import { AuthService } from "../../core/services/auth/auth.service";
import { User } from "../../models/User";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
	users: UserGame[] = [];
	totalMount: number;
	montoInvertir: number;
	cantPersonas: number;
	userActual: User;

	constructor(private groupService: GroupService, private authService: AuthService) {}

	ngOnInit() {
		this.getUser();
		this.createUsers();
		this.verifyCantUsers();
		this.calcularTotalMonto();
		this.getUser();
	}

	verifyCantUsers() {
		if (this.users.length === 6) {
			this.users.splice(0, 1);

			const user7 = new UserGame();
			user7.IdUser = 6;
			user7.Position = this.users.length + 1;
			user7.UserName = "Camila";
			this.users.push(user7);
		}
	}

	getUser() {
		this.userActual = JSON.parse(localStorage.getItem("identity"));
		this.userActual._id = 2;
	}

	getUsersActiveGroup() {
		this.groupService.addMemberToGroup(null, 1).subscribe(response => {
			this.users = response.users;
		});
	}

	calcularTotalMonto() {
		this.montoInvertir = 10;
		this.cantPersonas = 6;

		this.totalMount = this.montoInvertir * this.cantPersonas;
	}

	createUsers() {
		const user1 = new UserGame();
		user1.IdUser = 1;
		user1.Position = 1;
		user1.UserName = "Fernando";

		const user2 = new UserGame();
		user2.IdUser = 2;
		user2.Position = 2;
		user2.UserName = "Moises";

		const user3 = new UserGame();
		user3.IdUser = 3;
		user3.Position = 3;
		user3.UserName = "Jake";

		const user4 = new UserGame();
		user4.IdUser = 4;
		user4.Position = 4;
		user4.UserName = "Genaro";

		const user5 = new UserGame();
		user5.IdUser = 5;
		user5.Position = 5;
		user5.UserName = "Roger";

		const user6 = new UserGame();
		user6.IdUser = 6;
		user6.Position = 6;
		user6.UserName = "Cristian";

		this.users.push(user1);
		this.users.push(user2);
		this.users.push(user3);
		this.users.push(user4);
		this.users.push(user5);
		this.users.push(user6);
	}
}
