import { Injectable } from '@angular/core';
import { AppUser } from '../model/user.model';
import { UUID } from 'angular2-uuid';
import { Observable,of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticatedUser :AppUser | undefined;

  users : AppUser[] = [];
  constructor() { 
    this.users.push({userId:UUID.UUID(),username:"admin",password:"123",role:["ADMIN","USER"]})
    this.users.push({userId:UUID.UUID(),username:"user1",password:"123",role:["USER"]})
    this.users.push({userId:UUID.UUID(),username:"user2",password:"123",role:["USER"]})
  }

  public login(username:string,password:string): Observable<AppUser>{
  
    let appUser = this.users.find(u => u.username == username);
    if(!appUser) return throwError(()=>new Error("user not found"))
    if(appUser.password != password) return throwError(()=>new Error("password incorect"))
    return of(appUser)
  }
  public authenticateUser(appUser : AppUser):Observable<boolean>{
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser",JSON.stringify({username:appUser.username,role:appUser.role,jwt:"JWT_token"}))
    return of(true)
  }

  public hasRole(role:string): boolean{
    return this.authenticatedUser!.role.includes(role);
  }

  public isAuthenticated(){
    return this.authenticatedUser != undefined;
  }
  public logout():Observable<boolean>{
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser")
    return of(true)
  }
}
