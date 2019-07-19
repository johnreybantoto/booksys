import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service.';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLogin: boolean;
  userName: string;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ){  }

  ngOnInit(){
    this.checkLogin();
  }
  
  checkLogin(){
    let token = localStorage.getItem('token')
    if(token){
      this.isLogin = true;
      this.getUserInfo();
    } else {
      this.isLogin = false;
    }
  }

  async getUserInfo(){
    try {
      let userInfo = await this.userService.userProfile().toPromise();
      this.userName = userInfo.userName;
    } catch (error) {
      this.toastrService.error('Something went wrong');
    }
  }
}
