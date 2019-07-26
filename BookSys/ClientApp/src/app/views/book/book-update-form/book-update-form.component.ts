import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookDataService } from 'src/app/dataservices/book.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Book } from 'src/app/models/book.model';
import { Genre } from 'src/app/models/genre.model';
import { GenreService } from 'src/app/services/genre.service';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { GenreComponent } from '../../genre/genre.component';
import { AuthorComponent } from '../../author/author.component';
import { Author } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';
import { AuthorDataService } from 'src/app/dataservices/author.dataservice';

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
  
  authorsList: Author[];
  selectedAuthors: Author[] = [];

  constructor(
    private bookService: BookService,
    private bookDataService: BookDataService,
    private genreService: GenreService,
    private genreDataService: GenreDataService,
    private authorService: AuthorService,
    private authorDataService: AuthorDataService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BookUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.bookEditForm = this.formBuilder.group({
      id: new FormControl(),
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      copyright: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      genreID: new FormControl('', Validators.required),
      genreSelect: new FormControl('', Validators.required),
      authorID: new FormControl(''),
      authorSelect: new FormControl(''),
      authorIdList: this.formBuilder.array([])
    })
    this.bookContext = data;
  }

  get f() { return this.bookEditForm.controls;}

  async ngOnInit() {
    this.bookToBeEditted = this.bookContext.bookContext;
    // to show update genre lists when genre is updated
    this.genreDataService.genreSource.subscribe(async data => {
      await this.getGenreLists();
      if(!this.initialized){
        this.change()
        this.initialized = true;
      }
    })
    this.authorDataService.authorSource.subscribe(async data => {
      await this.getAuthorLists();
      if(!this.initialized){
        this.change()
        this.initialized = true;
      }
    })

  }
  
  change(){
    this.bookEditForm.controls['title'].setValue(this.bookToBeEditted.title);
    this.bookEditForm.controls['copyright'].setValue(this.bookToBeEditted.copyright);
    this.bookEditForm.controls['genreID'].setValue(this.bookToBeEditted.genreID);

    let genreName = this.genresList.find(data => data.id === this.bookToBeEditted.genreID)
    this.bookEditForm.controls['genreSelect'].setValue(genreName.name);
    this.selectedAuthors = this.bookToBeEditted.authors;
    console.log(this.selectedAuthors)
    console.log(this.bookEditForm.value)
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
                                            // assigns only the id of the selected authors
      this.bookEditForm.value.authorIdList = this.selectedAuthors.map(data => {return data.id})
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

  async getAuthorLists(){
    try {
      this.authorsList = await this.authorService.getAll().toPromise();
    } catch (error) {
      console.log(error);
    }

  }
  async getGenreLists(){
    try {
      this.genresList =  await this.genreService.getAll().toPromise();
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

 // find the selected genre from the list
 selectAuthor($event){
  let author = this.bookEditForm.value.authorSelect;
  if (author.length > 2) {
    if ($event.timeStamp > 200) {
      let selectedAuthor = this.authorsList.find(data => data.fullName == author);
      if(selectedAuthor){
        // checks if selected author does exists in the lists of selected
        if(!this.selectedAuthors.some(data => data === selectedAuthor))
          this.selectedAuthors.push(selectedAuthor);
      }
    }
  }
}

 // find the selected genre from the list
 removeAuthor(author){
  // checks if selected author does exists in the lists of selected
  let newAuthorLists = this.selectedAuthors.filter(data => data != author );
  this.selectedAuthors = newAuthorLists
}

openGenreDialog(){
  const dialogConfig = new MatDialogConfig();
  
  dialogConfig.width = '600px';
  dialogConfig.height = '600px';
  this.dialog.open(GenreComponent, dialogConfig)
}

openAuthorDialog(){
  const dialogConfig = new MatDialogConfig();
  
  dialogConfig.width = '600px';
  dialogConfig.height = '600px';
  this.dialog.open(AuthorComponent, dialogConfig)
}
 
}
