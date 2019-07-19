import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service.';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('token')){
        let roles = next.data['permittedRoles'] as Array<string>;
        if(roles){
          if(this.userService.roleMatch(roles)) return true;
          else{
            this.router.navigate(['/forbidden']);
            return false;
          }
        }
        return true;
      } else {
        window.location.replace('/')
        return false;
      }
  }
}