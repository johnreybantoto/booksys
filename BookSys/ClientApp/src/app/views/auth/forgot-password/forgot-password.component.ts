import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service.';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  userNameCheck: string;
  userNameToSubmit: string;
  question: string;
  isSubmit = false;
  wrongAnswer = false;
  newPasswordBackendError = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.forgotPasswordForm = new FormGroup({
      userName: new FormControl(''),
      newPassword: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    // redirects user to homepage if user is logged in
    let token = localStorage.getItem('token')
    if(token)
      this.router.navigateByUrl('/')
  }

  get f() { return this.forgotPasswordForm.controls; }

  async getSecurityQuestion(){
    try {
      this.isSubmit = true;
      let question = await this.userService.getSecurityQuestion(this.userNameCheck).toPromise();
      this.question = question.question;
      this.userNameToSubmit = this.userNameCheck;
    } catch (error) {
      console.error(error)
      if(error.status == 404)
        this.toastr.error('User not found')
    } finally {
      this.isSubmit = false;
    }
  }

  async resetPassword(){
    try {
      if(this.forgotPasswordForm.valid){
        // resets variables
        this.isSubmit = true;
        this.wrongAnswer = false;
        this.newPasswordBackendError = null;
        this.forgotPasswordForm.value.userName = this.userNameToSubmit;
        let result = await this.userService.resetPassword(this.forgotPasswordForm.value).toPromise();
        alert(result.message)
        // redirect to homepage
        this.router.navigateByUrl('/')
      }
    } catch (error) {
      console.error(error)
      // displays error
      if(!error.error.isSuccess){
        this.wrongAnswer = true;
        this.toastr.error('Wrong answer!')
      }
      if(error.error.errors){
        if('NewPassword' in error.error.errors){
          this.newPasswordBackendError = error.error.errors.NewPassword;
        }
      }
    } finally{
      this.isSubmit = false;
    }
  }

}
