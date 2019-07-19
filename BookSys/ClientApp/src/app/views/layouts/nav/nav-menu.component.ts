import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isLogin: boolean;
  role: string;

  constructor(
  ){  }

  ngOnInit(){
    this.checkLogin();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  checkLogin(){
    let token = localStorage.getItem('token')
    if(token){
      var payLoad = JSON.parse(window.atob(token.split('.')[1]));
      // takes the role from the token data
      var userRole = payLoad.role;
      this.role = userRole;
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }

  logout(){
    let answer = confirm('Are you sure you want to logout')
    if(answer){
      localStorage.removeItem('token')
      this.isLogin = false;
      window.location.replace('/')
    }
  }
}
