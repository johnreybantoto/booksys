import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenreService } from 'src/app/services/genre.service';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';

@Component({
  selector: 'app-genre-add-form',
  templateUrl: './genre-add-form.component.html',
  styleUrls: ['./genre-add-form.component.css']
})
export class GenreAddFormComponent implements OnInit {
  genreCreateForm: FormGroup;
  isSubmit = false;

  nameBackEndErrors: string[];
  copyrightBackEndErrors: string[];

  constructor(
    private genreService: GenreService,
    private genreDataService: GenreDataService
  ) { 
    this.genreCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
  }

  ngOnInit() {
  }

  get f() { return this.genreCreateForm.controls; }


  async onFormSubmit() {
    let ok = confirm("Are you sure you want to submit?");
    // ends the function if the user did not confirm
    if(!ok){
      return; 
    }

    // ends the function once the genreCreateForm somehow is not valid
    if (!this.genreCreateForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.nameBackEndErrors = null; // resets backendErrors
      this.copyrightBackEndErrors = null;
      let result = await this.genreService.create(this.genreCreateForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.genreCreateForm.reset();
        this.genreDataService.refreshGenres(); // triggers a function that will refresh other component that subscribe to it
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
