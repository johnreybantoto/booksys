import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Person } from '../models/person.model';
import { MyResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  personApi: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
    ){ 
      this.personApi = baseUrl + 'api/MySample/';
  }

  getMyName(): Observable<MyResponse>{
    return this.http.get<MyResponse>(this.personApi + 'MyName');
  }

  getYourName(name: string): Observable<MyResponse>{
    return this.http.get<MyResponse>(this.personApi + 'YourName/' + name);
  }

  checkLegalAge(person: Person): Observable<MyResponse> {
    return this.http.post<MyResponse>(this.personApi + 'LegalAge', person);
  }
}
