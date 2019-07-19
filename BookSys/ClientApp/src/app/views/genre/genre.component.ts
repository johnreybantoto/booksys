import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GenreService } from 'src/app/services/genre.service';
import { Genre } from 'src/app/models/genre.model';
import { GenreDataService } from 'src/app/dataservices/genre.dataservice';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { GenreUpdateFormComponent } from './genre-update-form/genre-update-form.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements AfterViewInit, OnDestroy, OnInit {

  // for angular datatable
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Genre> = new Subject();
  
  genres: Genre[];

  constructor(
    private genreService: GenreService,
    private genreDataService: GenreDataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GenreComponent>
  ) { }

  ngOnInit() {
    // will trigger everytime GenreDataService.refreshGenres() is called
    this.genreDataService.genres.subscribe( data => {
      this.getGenres();
    })
  }

  // call the getAll function then asign to genres to be displayed
  async getGenres(){
    try {
      this.genres = await this.genreService.getAll().toPromise();
      this.rerender();
    } catch (error) {
      alert('Something went wrong!');
      console.error(error);
    }
  }

  async delete(id){
    if(confirm('Are you sure you want to delete')){
      try {
        let result = await this.genreService.delete(id).toPromise()
        if(result.isSuccess){
          alert(result.message)
          this.genreDataService.refreshGenres();
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Something went wrong');
        console.log(error)
      }
    }
  }

  update(genre){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      genreContext: genre
    };
    dialogConfig.width = '600px';
    this.dialog.open(GenreUpdateFormComponent, dialogConfig)
  }

  close(){
    this.dialogRef.close();
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
