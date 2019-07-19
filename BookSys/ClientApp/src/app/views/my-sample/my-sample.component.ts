import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-my-sample',
  templateUrl: './my-sample.component.html',
  styleUrls: ['./my-sample.component.css']
})
export class MySampleComponent implements OnInit {
  sampleCreateForm: FormGroup;
  isSubmit = false;
  myName: string;
  yourName: string;

  yourNameResponse: string;

  nameBackEndErrors: string[];
  ageBackEndErrors: string[];

  constructor(
    private personService: PersonService
  ) { 
    this.sampleCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      age: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
  }

  ngOnInit() {
    this.getMyName();
    this.run();
    let inputtedChars  = [ 't', 'r', 'e', 's', 'i', 'd', 'd', 'e', 'r']
    console.log("The agreed word is " + this.removeDoubleLetters(inputtedChars));
  }

  get f() { return this.sampleCreateForm.controls; }

  async submitYourName(){
    try {
      let yourName = await this.personService.getYourName(this.yourName).toPromise();
      this.yourNameResponse = yourName.message;
    } catch (error) {
      alert('An error occured');
      console.error(error);
    }
  }

  async getMyName(){
    try {
      let myName = await this.personService.getMyName().toPromise();
      this.myName = myName.message;
    } catch (error) {
      alert('An error occured');
      console.error(error);
    }
  }

  async onFormSubmit() {
    let ok = confirm("Are you sure you want to submit?");
    // ends the function if the user did not confirm
    if(!ok){
      return; 
    }

    // ends the function once the sampleCreateForm somehow is not valid
    if (!this.sampleCreateForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.nameBackEndErrors = null; // resets backendErrors
      this.ageBackEndErrors = null;
      let result = await this.personService.checkLegalAge(this.sampleCreateForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.sampleCreateForm.reset();
      }
      else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error)
      let errs = error.error
      
      if(errs.isSuccess === false){
        alert(errs.message); // shows the customed error message
        return;
      } 
      if(errs.errors){
        if('Name' in errs.errors) {
          this.nameBackEndErrors = errs.errors.Name; // shows the data annotations error message
        } 
        if('Age' in errs.errors) {
          this.ageBackEndErrors = errs.errors.Age; // shows the data annotations error message
        }
      }

      this.isSubmit = false; // resets the isSubmit, enables button
    } finally{
      this.isSubmit = false; // resets the isSubmit, enables button
    }
  }

  run(){
    let num1 = 2;
    let num2 = 13;
    
    console.log("the 1st number is: " + this.mystery(num1, 6).toString());
    console.log("the 2nd number is: " + this.mystery(num2 % 5, 1+ num1 * 2));
  }

  mystery(num1: number, num2: number){
    num1 = this.unknown(num1, num2);
    num2 = this.unknown(num2, num1);
    return(num2);
  }

  unknown(num1: number, num2: number){
    let num3 = num1 + num2;
    num2 += num3 *2;
    return num2;
  }

  removeDoubleLetters(inputtedChars: string[]){
    let agreedWord = "";
    for(let i = 0 ; i < inputtedChars.length; i++){
      if(inputtedChars[i] == inputtedChars[i+1]){
        for(let y = i+1; y < inputtedChars.length - 1; y++){
          inputtedChars[y] = inputtedChars[y + 1]
        }
      }
    }

    for(let j = 0; j < inputtedChars.length; j++){
      agreedWord += inputtedChars[j];
    }
    return agreedWord;
  }
}
