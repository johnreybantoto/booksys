import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/services/author.service';
import { AuthorDataService } from 'src/app/dataservices/author.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Author } from 'src/app/models/author.model';

@Component({
  selector: 'app-author-update-form',
  templateUrl: './author-update-form.component.html',
  styleUrls: ['./author-update-form.component.css']
})
export class AuthorUpdateFormComponent implements OnInit {
  isSubmit = false;
  firstNameBackEndErrors: string[];
  middleNameBackEndErrors: string[];
  lastNameBackEndErrors: string[];

  authorContext: any;
  authorUpdateForm: FormGroup;
  authorToBeEditted: Author;

  constructor(
    private authorService: AuthorService,
    private authorDataService: AuthorDataService,
    public dialogRef: MatDialogRef<AuthorUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.authorUpdateForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
    this.authorContext = data;
  }

  get f() { return this.authorUpdateForm.controls;}

  ngOnInit() {
    this.authorToBeEditted = this.authorContext.authorContext;
    this.change();
  }
  
  change(){
    this.authorUpdateForm.controls['firstName'].setValue(this.authorToBeEditted.firstName);
    this.authorUpdateForm.controls['middleName'].setValue(this.authorToBeEditted.middleName);
    this.authorUpdateForm.controls['lastName'].setValue(this.authorToBeEditted.lastName);
  }

  close(){
    this.dialogRef.close();
  }

  async onFormSubmit() {
    let ok = confirm("Are you sure you want to submit?");
    // ends the function if the user did not confirm
    if(!ok){
      return; 
    }

    // ends the function once the authorUpdateForm somehow is not valid
    if (!this.authorUpdateForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.firstNameBackEndErrors = null; // resets backendErrors
      this.middleNameBackEndErrors = null; 
      this.lastNameBackEndErrors = null; 
      this.authorUpdateForm.value.id = this.authorToBeEditted.id;
      let result = await this.authorService.update(this.authorUpdateForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.authorUpdateForm.reset();
        this.authorDataService.refreshAuthors(); // triggers a function that will refresh other component that subscribe to it
        this.close();
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
        if('LastName' in errs.errors) {
          this.lastNameBackEndErrors = errs.errors.LastName; // shows the data annotations error message
        } 
      }

      this.isSubmit = false; // resets the isSubmit, enables button
    } finally{
      this.isSubmit = false; // resets the isSubmit, enables button
    }
  }

}
