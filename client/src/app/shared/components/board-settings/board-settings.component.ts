import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {from, Observable} from 'rxjs';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
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
      map(value => this.fb.group(value || {loop: 0})),
      shareReplay(1)
    );
  }

  save() {
    return this.form$.pipe(
      switchMap(form =>
        from(
          this.afs
            .collection(FirestoreCollections.Settings)
            .doc(FirestoreStaticDocuments.BoardSettings)
            .set(form.getRawValue(), {
              merge: true
            })
        )
      ),
      notify(),
      tap(() => this.dialogRef.close())
    );
  }
}
