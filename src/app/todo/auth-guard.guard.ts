import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    console.log("state",state);
    
    const sessionEmail = sessionStorage.getItem('userId');

    if (sessionEmail) {
      if (state.url == '/login' || state.url == '/register') {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }

    if (!sessionEmail) {
      if (state.url == '/login' || state.url == '/register') {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }

    return false;
  }
}
