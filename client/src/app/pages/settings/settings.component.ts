import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {finalize, map, take} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../shared/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '../../shared/enums/firestore-static-documents.enum';
import {Role} from '../../shared/enums/role.enum';
import {Settings} from '../../shared/interfaces/settings.interface';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jgb-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(private afs: AngularFirestore, private fb: FormBuilder) {}

  form$: Observable<FormGroup>;
  loading$ = new BehaviorSubject(false);
  role = Role;

  ngOnInit() {
    this.form$ = this.afs
      .collection(FirestoreCollections.Settings)
      .doc(FirestoreStaticDocuments.GeneralSettings)
      .valueChanges()
      .pipe(
        take(1),
        map((value: Settings) => {
          return this.fb.group({
            members: this.fb.array(
              (value.members || []).map(member => this.mapMember(member))
            )
          });
        })
      );
  }

  getMembers(form: FormGroup) {
    return form.get('members') as FormArray;
  }

  mapMember(member = {}) {
    return this.fb.group({
      email: ['', Validators.required],
      role: Role.Member
    });
  }

  addMember(form: FormGroup) {
    const members = form.get('members') as FormArray;
    members.push(this.mapMember());
  }

  removeMember(form: FormGroup, index: number) {
    const members = form.get('members') as FormArray;
    members.removeAt(index);
  }

  save(data) {
    this.loading$.next(true);

    from(
      this.afs
        .collection(FirestoreCollections.Settings)
        .doc(FirestoreStaticDocuments.GeneralSettings)
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
