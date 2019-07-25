import { BehaviorSubject } from 'rxjs';
import { OnDestroy, Injectable } from '@angular/core';
import { Author } from '../models/author.model';

@Injectable({
    providedIn: 'root'
  })
export class AuthorDataService implements OnDestroy {
    authorSource = new BehaviorSubject<Author[]>([]);
    authors = this.authorSource.asObservable();

    constructor(){
    }

    // refresh other component that subscribe to it
    refreshAuthors() {
        this.authorSource.next(null);
    }

    ngOnDestroy(){
        this.authorSource.unsubscribe();
    }
}
