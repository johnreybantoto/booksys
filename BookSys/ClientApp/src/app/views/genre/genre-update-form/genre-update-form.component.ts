import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenreService } from 'src/app/services/genre.service';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Genre } from 'src/app/models/genre.model';

@Component({
  selector: 'app-genre-update-form',
  templateUrl: './genre-update-form.component.html',
  styleUrls: ['./genre-update-form.component.css']
})
export class GenreUpdateFormComponent implements OnInit {
  isSubmit = false;
  nameBackEndErrors: string[];
  copyrightBackEndErrors: string[];

  genreContext: any;
  genreEditForm: FormGroup;
  genreToBeEditted: Genre;

  constructor(
    private genreService: GenreService,
    private genreDataService: GenreDataService,
    public dialogRef: MatDialogRef<GenreUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.genreEditForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
    this.genreContext = data;
  }

  get f() { return this.genreEditForm.controls;}

  ngOnInit() {
    this.genreToBeEditted = this.genreContext.genreContext;
    this.change();
  }
  
  change(){
    this.genreEditForm.controls['name'].setValue(this.genreToBeEditted.name);
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

    // ends the function once the genreEditForm somehow is not valid
    if (!this.genreEditForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.nameBackEndErrors = null; // resets backendErrors
      this.copyrightBackEndErrors = null;
      this.genreEditForm.value.id = this.genreToBeEditted.id;
      let result = await this.genreService.update(this.genreEditForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.genreEditForm.reset();
        this.genreDataService.refreshGenres(); // triggers a function that will refresh other component that subscribe to it
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
        if('name' in errs.errors) {
          this.nameBackEndErrors = errs.errors.name; // shows the data annotations error message
        } 
      }

      this.isSubmit = false; // resets the isSubmit, enables button
    } finally{
      this.isSubmit = false; // resets the isSubmit, enables button
    }
  }

}
