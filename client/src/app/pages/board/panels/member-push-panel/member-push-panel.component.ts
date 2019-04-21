import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventType} from '../../../../../../../shared/enums/event-type.enum';
import {FirebaseOperator} from '../../../../../../../shared/enums/firebase-operator.enum';
import {FirestoreCollections} from '../../../../../../../shared/enums/firestore-collections.enum';
import {today} from '../../../../../../../shared/utils/today';

@Component({
  selector: 'jgb-member-push-panel',
  templateUrl: './member-push-panel.component.html',
  styleUrls: ['./member-push-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberPushPanelComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}

  members$: Observable<any>;

  ngOnInit() {
    const date = today();

    // TODO: This needs to be optimized when more panels are introduced
    this.members$ = combineLatest(
      this.afs.collection(FirestoreCollections.Members).valueChanges(),
      this.afs
        .collection(FirestoreCollections.Events, ref =>
          ref
            .where('date', FirebaseOperator.Equal, date)
            .where('type', FirebaseOperator.Equal, EventType.Push)
        )
        .valueChanges()
    ).pipe(
      map(([members, events]: [any, any]) => {
        return members.reduce((acc, cur) => {
          if (cur.github || cur.gitlab) {
            const evs = events.filter(
              event =>
                event.commit.author.username === cur.github ||
                event.commit.author.username === cur.gitlab
            );

            acc.push({
              member: cur,
              event: evs.sort(
                (a, b) =>
                  new Date(b.commit.timestamp).getTime() -
                  new Date(a.commit.timestamp).getTime()
              )[0]
            });
          }

          return acc;
        }, []);
      })
    );
  }
}
