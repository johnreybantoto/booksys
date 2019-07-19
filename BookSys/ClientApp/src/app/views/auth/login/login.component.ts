import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service.';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmit = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { 
    this.loginForm = new FormGroup({
      userName: new FormControl ('', [Validators.required]),
      password: new FormControl ('', [Validators.required])
    })
  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  async submit(){
    try {
      this.isSubmit = true;
      let result = await this.userService.login(this.loginForm.value).toPromise();
      if(result.isSuccess && result.identifier){
        this.toastr.success(result.message)
        // saves the token to local storage which we will use in api requests that requires authorization
        localStorage.setItem('token', result.identifier)
        // reloads the page
        window.location.replace('/')
      }
    } catch (error) {
      console.log(error)
      if(!error.error.isSuccess)
        this.toastr.error(error.error.message)
      else
        this.toastr.error('Something went wrong')
    } finally {
      this.isSubmit = false;
    }
  }
}
