import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {from, Observable} from 'rxjs';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../../shared/enums/firestore-collections.enum';
import {Member} from '../../interfaces/member.interface';
import {notify} from '../../utils/notify.operator';
import {MembersComponent} from '../members/members.component';

@Component({
  selector: 'jgb-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MembersComponent>
  ) {}

  form$: Observable<FormGroup>;

  ngOnInit() {
    this.form$ = this.afAuth.user.pipe(
      switchMap(({email}) =>
        this.afs
          .collection(FirestoreCollections.Members)
          .doc<Member>(email)
          .valueChanges()
          .pipe(
            take(1),
            map(value => {
              value = value || {email};

              return this.fb.group({
                email: {value: email, disabled: true},
                name: value.name || '',
                github: value.github || '',
                gitlab: value.gitlab || ''
              });
            })
          )
      ),
      shareReplay(1)
    );
  }

  save() {
    return this.form$.pipe(
      switchMap(form => {
        const {email, ...data} = form.getRawValue();

        return from(
          this.afs
            .collection(FirestoreCollections.Members)
            .doc(email)
            .set(data, {
              merge: true
            })
        );
      }),
      notify(),
      tap(() => this.dialogRef.close())
    );
  }
}
