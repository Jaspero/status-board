import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../../shared/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '../../enums/firestore-static-documents.enum';
import {BoardSettings} from '../../interfaces/board-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private afs: AngularFirestore) {
    this.boardSettings$ = this.afs
      .collection(FirestoreCollections.Settings)
      .doc<BoardSettings>(FirestoreStaticDocuments.BoardSettings)
      .valueChanges()
      .pipe(shareReplay(1));
  }

  boardSettings$: Observable<BoardSettings>;
  editMode$ = new BehaviorSubject(false);

  toggleEdit() {
    let current: boolean;

    this.editMode$.pipe(take(1)).subscribe(value => (current = value));

    this.editMode$.next(!current);
  }
}
