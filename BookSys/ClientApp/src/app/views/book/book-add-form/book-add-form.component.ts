import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookDataService } from 'src/app/dataservices/book.dataservice';
import { Genre } from 'src/app/models/genre.model';
import { GenreService } from 'src/app/services/genre.service';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GenreComponent } from '../../genre/genre.component';
import { Author } from 'src/app/models/author.model';

@Component({
  selector: 'app-book-add-form',
  templateUrl: './book-add-form.component.html',
  styleUrls: ['./book-add-form.component.css']
})
export class BookAddFormComponent implements OnInit, OnChanges {
  bookCreateForm: FormGroup;
  isSubmit = false;

  titleBackEndErrors: string[];
  copyrightBackEndErrors: string[];

  genresList: Genre[];

  dialogOpen = false;

  bookAuthor: Author;

  constructor(
    private bookService: BookService,
    private bookDataService: BookDataService,
    private genreService: GenreService,
    private genreDataService: GenreDataService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { 
    this.bookCreateForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      copyright: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      genreID: new FormControl('', Validators.required),
      genreSelect: new FormControl('', Validators.required),
      authorIdList: this.formBuilder.array([])
    })
  }

  ngOnInit() {
    this.genreDataService.genreSource.subscribe(data => {
      this.getGenreLists();
    })
  }

  ngOnChanges(){
    console.log(this.bookAuthor);
  }

  get f() { return this.bookCreateForm.controls; }

  addedAuthor($event){
    this.bookAuthor = $event;
  }

  async onFormSubmit() {
    let ok = confirm("Are you sure you want to submit?");
    // ends the function if the user did not confirm
    if(!ok){
      return; 
    }

    // ends the function once the bookCreateForm somehow is not valid
    if (!this.bookCreateForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.titleBackEndErrors = null; // resets backendErrors
      this.copyrightBackEndErrors = null;
      let result = await this.bookService.create(this.bookCreateForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.bookCreateForm.reset();
        this.bookDataService.refreshBooks(); // triggers a function that will refresh other component that subscribe to it
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
        if('title' in errs.errors) {
          this.titleBackEndErrors = errs.errors.title; // shows the data annotations error message
        } 
        if('copyright' in errs.errors) {
          this.copyrightBackEndErrors = errs.errors.copyright; // shows the data annotations error message
        }
      }

      this.isSubmit = false; // resets the isSubmit, enables button
    } finally{
      this.isSubmit = false; // resets the isSubmit, enables button
    }
  }

  async getGenreLists(){
    try {
      this.genresList = await this.genreService.getAll().toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // find the selected genre from the list
  selectGenre($event){
    let genre = this.bookCreateForm.value.genreSelect;
    if (genre.length > 2) {
      if ($event.timeStamp > 200) {
        let selectedGenre = this.genresList.find(data => data.name == genre);
        if(selectedGenre){
          this.bookCreateForm.controls['genreID'].setValue(selectedGenre.id);
        }
      }
    }
  }

  openGenreDialog(){
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.width = '600px';
    dialogConfig.height = '600px';
    this.dialog.open(GenreComponent, dialogConfig)
  }
}
