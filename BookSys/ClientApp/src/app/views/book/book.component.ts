import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';
import { BookDataService } from 'src/app/dataservices/book.dataservice';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { BookUpdateFormComponent } from './book-update-form/book-update-form.component';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements AfterViewInit, OnDestroy, OnInit {
  books: Book[];

  dialogOpen = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Book> = new Subject();

  constructor(
    private bookService: BookService,
    private bookDataService: BookDataService,
    private genreDataService: GenreDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // will trigger everytime BookDataService.refreshBooks() is called
    this.bookDataService.books.subscribe( data => {
      this.getBooks();
    })

    this.genreDataService.genreSource.subscribe( data => {
      this.getBooks();
    })
  }

  // call the getAll function then asign to books to be displayed
  async getBooks(){
    try {
      this.dtOptions = {    
        pagingType: "full_numbers",    
        pageLength: 10,    
        serverSide: true,    
        processing: true,    
        searching: true,    
        ajax: async (dataTablesParameters: any, callback) => {    
          let data = await this.bookService.getDataServerSide(dataTablesParameters).toPromise()
          this.books = data.data;    
          callback({    
            recordsTotal: data.recordsTotal,    
            recordsFiltered: data.recordsFiltered,    
            data: []    
          });    
        },    
        columns: [null, null, null, null]    
      };
      this.rerender()
    } catch (error) {
      alert('Something went wrong!');
      console.error(error);
    }
  }

  async delete(id){
    if(confirm('Are you sure you want to delete')){
      try {
        let result = await this.bookService.delete(id).toPromise()
        if(result.isSuccess){
          alert(result.message)
          this.bookDataService.refreshBooks();
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Something went wrong');
        console.log(error)
      }
    }
  }

  update(book){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bookContext: book
    };
    dialogConfig.width = '600px';
    this.dialogOpen =  true;
    let dialogRef = this.dialog.open(BookUpdateFormComponent, dialogConfig)
    dialogRef.afterClosed().subscribe( data => {
      this.dialogOpen = false;
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if(this.dtElement){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

}
