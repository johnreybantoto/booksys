import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';
import { OnDestroy, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class BookDataService implements OnDestroy {
    bookSource = new BehaviorSubject<Book[]>([]);
    books = this.bookSource.asObservable();

    constructor(){
    }

    // refresh other component that subscribe to it
    refreshBooks() {
        this.bookSource.next(null);
    }

    ngOnDestroy(){
        this.bookSource.unsubscribe();
    }
}
