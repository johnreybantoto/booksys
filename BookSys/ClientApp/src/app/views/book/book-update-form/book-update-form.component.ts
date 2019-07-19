import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookDataService } from 'src/app/dataservices/book.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Book } from 'src/app/models/book.model';
import { Genre } from 'src/app/models/genre.model';
import { GenreService } from 'src/app/services/genre.service';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { GenreComponent } from '../../genre/genre.component';

@Component({
  selector: 'app-book-update-form',
  templateUrl: './book-update-form.component.html',
  styleUrls: ['./book-update-form.component.css']
})
export class BookUpdateFormComponent implements OnInit {
  isSubmit = false;
  titleBackEndErrors: string[];
  copyrightBackEndErrors: string[];

  bookContext: any;
  bookEditForm: FormGroup;
  bookToBeEditted: Book;

  genresList: Genre[];
  initialized = false;

  constructor(
    private bookService: BookService,
    private bookDataService: BookDataService,
    private genreService: GenreService,
    private genreDataService: GenreDataService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BookUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.bookEditForm = new FormGroup({
      id: new FormControl(),
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      copyright: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      genreID: new FormControl('', Validators.required),
      genreSelect: new FormControl('', Validators.required)
    })
    this.bookContext = data;
  }

  get f() { return this.bookEditForm.controls;}

  async ngOnInit() {
    this.bookToBeEditted = this.bookContext.bookContext;
    // to show update genre lists when genre is updated
    this.bookDataService.bookSource.subscribe(data => {
      this.getGenreLists();
    })
  }
  
  change(){
    this.bookEditForm.controls['title'].setValue(this.bookToBeEditted.title);
    this.bookEditForm.controls['copyright'].setValue(this.bookToBeEditted.copyright);
    this.bookEditForm.controls['genreID'].setValue(this.bookToBeEditted.genreID);
    
    let genreName = this.genresList.find(data => data.id === this.bookToBeEditted.genreID)

    this.bookEditForm.controls['genreSelect'].setValue(genreName.name);
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

    // ends the function once the bookEditForm somehow is not valid
    if (!this.bookEditForm.valid)
      return;
      
    try {
      this.isSubmit = true; // sets the isSubmit, disables button
      this.titleBackEndErrors = null; // resets backendErrors
      this.copyrightBackEndErrors = null;
      this.bookEditForm.value.id = this.bookToBeEditted.id;
      let result = await this.bookService.update(this.bookEditForm.value).toPromise();
      if (result.isSuccess) {
        alert(result.message);
        this.bookEditForm.reset();
        this.bookDataService.refreshBooks(); // triggers a function that will refresh other component that subscribe to it
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
      if(!this.initialized){
        this.change();
        this.initialized;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // find the selected genre from the list
  selectGenre($event){
    let genre = this.bookEditForm.value.genreSelect;
    if (genre.length > 2) {
      if ($event.timeStamp > 200) {
        let selectedGenre = this.genresList.find(data => data.name == genre);
        if(selectedGenre){
          this.bookEditForm.controls['genreID'].setValue(selectedGenre.id);
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
