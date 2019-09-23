import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
// import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(public _user: UserService, public _router: Router){}

  canActivate(){

    this._user.checkLogin();
    console.log (this._user.checkingLogin)
    console.log(this._user.isLogged)
    if (this._user.checkingLogin == true || this._user.isLogged) {
      return true
    } else {
      this._router.navigateByUrl('/login');
      return false;
    }
/*     let interval = setInterval(() => {
        // console.log("guard")
        if(this._user.isLogged === true){
          clearInterval(interval)
          return true;
        } else {
          clearInterval(interval)
          this._router.navigateByUrl('/login');
          return false;      
        }}, 100) */
  }
  
}
