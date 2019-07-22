import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavMenuComponent } from './views/layouts/nav/nav-menu.component';
import { HomeComponent } from './views/home/home.component';
import { CounterComponent } from './views/counter/counter.component';
import { FetchDataComponent } from './views/fetch-data/fetch-data.component';
import { MySampleComponent } from './views/my-sample/my-sample.component';
import { BookComponent } from './views/book/book.component';
import { BookAddFormComponent } from './views/book/book-add-form/book-add-form.component';
import { BookUpdateFormComponent } from './views/book/book-update-form/book-update-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GenreComponent } from './views/genre/genre.component';
import { GenreAddFormComponent } from './views/genre/genre-add-form/genre-add-form.component';
import { GenreUpdateFormComponent } from './views/genre/genre-update-form/genre-update-form.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { DialogWrapperComponent } from './views/layouts/dialog-wrapper/dialog-wrapper.component';
import { LoginComponent } from './views/auth/login/login.component';
import { ForbiddenComponent } from './views/auth/forbidden/forbidden.component';
import { AuthInterceptor } from './guard/auth.interceptor';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    MySampleComponent,
    BookComponent,
    BookAddFormComponent,
    BookUpdateFormComponent,
    GenreComponent,
    GenreAddFormComponent,
    GenreUpdateFormComponent,
    RegisterComponent,
    DialogWrapperComponent,
    LoginComponent,
    ForbiddenComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    DataTablesModule
  ],
  entryComponents:[BookUpdateFormComponent, GenreUpdateFormComponent, GenreComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }