import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {from, Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../../shared/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '../../enums/firestore-static-documents.enum';
import {StateService} from '../../services/state/state.service';
import {notify} from '../../utils/notify.operator';

@Component({
  selector: 'jgb-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSettingsComponent implements OnInit {
  constructor(
    private state: StateService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private dialogRef: MatDialogRef<BoardSettingsComponent>
  ) {}

  form$: Observable<FormGroup>;

  ngOnInit() {
    this.form$ = this.state.boardSettings$.pipe(
      take(1),
      map(value => {
        return this.fb.group(value || {loop: 0});
      })
    );
  }

  save(data) {
    return from(
      this.afs
        .collection(FirestoreCollections.Settings)
        .doc(FirestoreStaticDocuments.BoardSettings)
        .set(data, {
          merge: true
        })
    ).pipe(
      notify(),
      tap(() => this.dialogRef.close())
    );
  }
}
