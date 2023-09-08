import { ActivatedRouteSnapshot,CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {of,Observable} from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class PermissionsService {

  constructor(
  private authService: AuthenticationService,
  public router: Router,
  ) { }
 
  canActivate(): boolean {
    let authenticated = this.authService.isAuthenticated();
    if(authenticated != true){ 
    this.router.navigateByUrl("/login");
    return false;
  }else {
    console.log('authenticated')
    return true;
  }
  }
 
  }


export const authenticationGuard1: CanActivateFn = (route, state) => {
  return true;
};

export const authGuardGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};



//this code work for now
export class authenticationGuard2 implements CanActivate
 {
  constructor( private authService: AuthenticationService, private router : Router) {
 
  }  canActivate(
    route:ActivatedRouteSnapshot,
    state:RouterStateSnapshot): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
      let authenticated = this.authService.isAuthenticated();
      if(authenticated==false){ 
      this.router.navigateByUrl("/login");
      return false;
    }else {
      return true;
    }
    }
      
}