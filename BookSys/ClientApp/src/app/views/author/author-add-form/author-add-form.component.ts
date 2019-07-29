import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/services/author.service';
import { AuthorDataService } from 'src/app/dataservices/author.dataservice';

@Component({
  selector: 'app-author-add-form',
  templateUrl: './author-add-form.component.html',
  styleUrls: ['./author-add-form.component.css']
})
export class AuthorAddFormComponent implements OnInit {
  authorCreateForm: FormGroup;
  isSubmit = false;

  firstNameBackEndErrors: string[];
  middleNameBackEndErrors: string[];
  lastNameBackEndErrors: string[];

  constructor(
    private authorService: AuthorService,
    private authorDataService: AuthorDataService
  ) { 
    this.authorCreateForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
  }

  ngOnInit() {
  }

  get f() { return this.authorCreateForm.controls; }


  async onFormSubmit() {
    let ok = confirm("Are you sure you want to submit?");
    // ends the function if the user did not confirm
    if(!ok){
      return; 
    }
    // ends the function once the authorCreateForm somehow is not valid
    if (!this.authorCreateForm.valid)
      return;
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.firstNameBackEndErrors = null; // resets backendErrors
      this.middleNameBackEndErrors = null; // resets backendErrors
      this.lastNameBackEndErrors = null; // resets backendErrors
      let result = await this.authorService.create(this.authorCreateForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.authorCreateForm.reset();
        this.authorDataService.refreshAuthors(); // triggers a function that will refresh other component that subscribe to it
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
        if('FirstName' in errs.errors) {
          this.firstNameBackEndErrors = errs.errors.FirstName; // shows the data annotations error message
        }
        if('LastName' in errs.errors) {
          this.lastNameBackEndErrors = errs.errors.LastName; // shows the data annotations error message
        }
        if('MiddleName' in errs.errors) {
          this.middleNameBackEndErrors = errs.errors.MiddleName; // shows the data annotations error message
        } 
      }
      this.isSubmit = false; // resets the isSubmit, enables button
    } finally{
      this.isSubmit = false; // resets the isSubmit, enables button
    }
  }
}
