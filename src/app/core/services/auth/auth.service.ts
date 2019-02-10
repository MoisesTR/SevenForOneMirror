import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UsuarioService} from '../shared/usuario.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  public jwtHelper;
  constructor(
      private router: Router,
      private usuarioService: UsuarioService
  ) {}

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    this.jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    // return token != null ? (!this.jwtHelper.isTokenExpired(token)) : false;
    return true;
    // return true;
  }

  public logout(): void {
      localStorage.clear();
      this.router.navigate(['/login']);
  }

}
