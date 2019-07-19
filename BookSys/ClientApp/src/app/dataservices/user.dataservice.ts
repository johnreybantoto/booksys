import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { OnDestroy, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class UserDataService implements OnDestroy {
    userSource = new BehaviorSubject<User[]>([]);
    users = this.userSource.asObservable();

    constructor(){
    }

    // refresh other component that subscribe to it
    refreshUsers() {
        this.userSource.next(null);
    }

    ngOnDestroy(){
        this.userSource.unsubscribe();
    }
}
