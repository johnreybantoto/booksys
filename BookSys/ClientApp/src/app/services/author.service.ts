import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../models/author.model';
import { Observable } from 'rxjs';
import { MyResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  authorApi: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) { 
    this.authorApi = baseUrl + 'api/Author/';
  }

  getAll() : Observable<Author[]> {
    return this.http.get<Author[]>(this.authorApi + 'GetAll');
  }

  getSingleBy(id) : Observable<Author>  {
    return this.http.get<Author>(this.authorApi + 'GetSingleBy' + String(id));
  }

  create(author : Author): Observable<MyResponse> {
    return this.http.post<MyResponse>(this.authorApi + 'Create', author);
  }

  update(author : Author): Observable<MyResponse> {
    return this.http.put<MyResponse>(this.authorApi + 'Update', author);
  }

  delete(id): Observable<MyResponse> {
    return this.http.delete<MyResponse>(this.authorApi + 'Delete/' + String(id));
  }
}
