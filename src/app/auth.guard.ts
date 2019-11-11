import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  token: any;

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.token = localStorage.getItem('access_token');
    if (this.token) {
      this.token = jwt_decode(this.token);
      if (!(Date.now() > this.token.exp * 1000)) {
        return true;
      }
      console.log('Token has expired');
    }

    this.router.navigate(['login']);
    return false;
  }
}
