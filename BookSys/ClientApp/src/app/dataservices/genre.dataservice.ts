import { BehaviorSubject } from 'rxjs';
import { Genre } from '../models/genre.model';
import { OnDestroy, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class GenreDataService implements OnDestroy {
    genreSource = new BehaviorSubject<Genre[]>([]);
    genres = this.genreSource.asObservable();

    constructor(){
    }

    // refresh other component that subscribe to it
    refreshGenres() {
        this.genreSource.next(null);
    }

    ngOnDestroy(){
        this.genreSource.unsubscribe();
    }
}
