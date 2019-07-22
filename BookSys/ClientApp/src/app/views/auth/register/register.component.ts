import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service.';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  userNameBackEndErrors: string[];
  passwordBackEndErrors: string[];
  firstNameBackEndErrors: string[];
  middleNameBackEndErrors: string[];
  lastNameBackEndErrors: string[];
  questionBackEndErrors: string[];
  answerBackEndErrors: string[];

  isSubmit = false;

  constructor(
    private userService: UserService,
  ) { 
    this.registerForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
  }

  get f() { return this.registerForm.controls; }

  async submit(){
    try {
      let answer = confirm('Are you sure you want to save?')
      
      if(!answer) // stops submission
        return;

      this.isSubmit = true;
      this.resetBackEndErrors();
      let result = await this.userService.register(this.registerForm.value).toPromise()

      if(result.isSuccess){
        alert('Successfully registerd!')
        this.registerForm.reset();
      } else {
        alert(result.message)
        if(result.errors.length > 0){
          result.errors.forEach(e => {
            if(e.code === 'DuplicateUserName'){
              this.userNameBackEndErrors = [];
              this.userNameBackEndErrors.push(e.description);
            }
              
            if(e.code === 'InvalidUserName'){
              this.userNameBackEndErrors = [];
              this.userNameBackEndErrors.push(e.description);
            }
          });
        }
        if(result.exceptionError){
          console.error(result.exceptionError)
        }
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong');
      if(error.error.errors)
        this.displayBackEndErrors(error.error.errors)
    } finally {
      this.isSubmit = false;
    }
  }

  displayBackEndErrors(errors){
    console.log(errors)
    if('UserName' in errors)
      this.userNameBackEndErrors = errors.UserName; // shows the data annotations error message
    if('Password' in errors) 
      this.passwordBackEndErrors = errors.Password; // shows the data annotations error message
    if('FirstName' in errors) 
      this.firstNameBackEndErrors = errors.FirstName; // shows the data annotations error message
    if('MiddleName' in errors) 
      this.middleNameBackEndErrors = errors.MiddleName; // shows the data annotations error message
    if('LastName' in errors) 
      this.lastNameBackEndErrors = errors.LastName; // shows the data annotations error message
    if('Question' in errors) 
      this.questionBackEndErrors = errors.Question; // shows the data annotations error message
    if('Answer' in errors) 
      this.answerBackEndErrors = errors.Answer; // shows the data annotations error message
  }

  resetBackEndErrors(){
    this.userNameBackEndErrors = null;
    this.passwordBackEndErrors = null;
    this.firstNameBackEndErrors = null;
    this.middleNameBackEndErrors = null;
    this.lastNameBackEndErrors = null;
    this.questionBackEndErrors = null;
    this.answerBackEndErrors = null;
  }
}
