import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {finalize, map, switchMap, take} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../shared/enums/firestore-collections.enum';
import {Member} from '../../shared/interfaces/member.interface';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jgb-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {}

  form$: Observable<FormGroup>;
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.form$ = this.afAuth.user.pipe(
      switchMap(({email}) =>
        this.afs
          .collection(FirestoreCollections.Members)
          .doc(email)
          .valueChanges()
          .pipe(
            take(1),
            map((value: Member) => {
              value = value || {email};

              return this.fb.group({
                email: {value: email, disabled: true},
                name: value.name || '',
                github: value.github || '',
                gitlab: value.gitlab || ''
              });
            })
          )
      )
    );
  }

  save({email, ...data}) {
    this.loading$.next(true);

    from(
      this.afs
        .collection(FirestoreCollections.Members)
        .doc(email)
        .set(data, {
          merge: true
        })
    )
      .pipe(
        finalize(() => this.loading$.next(false)),
        notify()
      )
      .subscribe();
  }
}
