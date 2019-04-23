import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor() {}

  editMode$ = new BehaviorSubject(false);

  toggleEdit() {
    let current: boolean;

    this.editMode$.pipe(take(1)).subscribe(value => (current = value));

    this.editMode$.next(!current);
  }
}
