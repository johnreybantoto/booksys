import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyResponse } from '../models/response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userApi: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) { 
    this.userApi = baseUrl + 'api/User/';
  }

  register(user: User) : Observable<MyResponse> {
    return this.http.post<MyResponse>(this.userApi + 'Register', user);
  }

  login(form) : Observable<MyResponse>{
    return this.http.post<MyResponse>(this.userApi + 'Login', form);
  }

  userProfile() : Observable<User> {
    return this.http.get<User>(this.userApi + 'UserProfile');
  }

  // function to be called when user access a route
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    // converts the token from base64 encoding then takes the role
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    // takes the role from the token data
    var userRole = payLoad.role;
    // checks if user role matched to the role defined in the route
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
      }
    });
    return isMatch;
  }
}
