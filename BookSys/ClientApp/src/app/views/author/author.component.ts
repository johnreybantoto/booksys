import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { AuthorService } from 'src/app/services/author.service';
import { Author } from 'src/app/models/author.model';
import { AuthorDataService } from 'src/app/dataservices/author.dataservice';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { AuthorUpdateFormComponent } from './author-update-form/author-update-form.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements AfterViewInit, OnDestroy, OnInit {

  // for angular datatable
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Author> = new Subject();
  
  authors: Author[];
  currentRoute: string;


  constructor(
    private authorService: AuthorService,
    private authorDataService: AuthorDataService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<AuthorComponent>
  ) { 
    this.currentRoute = this.router.url;
  }

  ngOnInit() {
    // will trigger everytime AuthorDataService.refreshAuthors() is called
    this.authorDataService.authors.subscribe( data => {
      this.getAuthors();
    })
    console.log(this.currentRoute)
  }

  // call the getAll function then asign to authors to be displayed
  async getAuthors(){
    try {
      this.authors = await this.authorService.getAll().toPromise();
      this.rerender();
    } catch (error) {
      alert('Something went wrong!');
      console.error(error);
    }
  }

  async delete(id){
    if(confirm('Are you sure you want to delete')){
      try {
        let result = await this.authorService.delete(id).toPromise()
        if(result.isSuccess){
          alert(result.message)
          this.authorDataService.refreshAuthors();
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Something went wrong');
        console.log(error)
      }
    }
  }

  update(author){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      authorContext: author
    };
    dialogConfig.width = '600px';
    this.dialog.open(AuthorUpdateFormComponent, dialogConfig)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
