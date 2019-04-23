import {ComponentPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/internal/operators';
import {map, switchMap} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../shared/enums/firestore-collections.enum';
import {PanelType} from '../../shared/enums/panel-type.enum';
import {Board} from '../../shared/interfaces/board.interface';
import {Panel} from '../../shared/interfaces/panel.interface';
import {StateService} from '../../shared/services/state/state.service';
import {MemberPushPanelComponent} from './panels/member-push-panel/member-push-panel.component';

@Component({
  selector: 'jgb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  constructor(
    public state: StateService,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  board$: Observable<
    Array<{
      panel: Panel;
      portal: ComponentPortal<any>;
    }>
  >;

  boards$: Observable<Board[]>;

  ngOnInit() {
    const panelMap = {
      [PanelType.MemberPush]: MemberPushPanelComponent
    };

    this.boards$ = this.afs
      .collection(FirestoreCollections.Boards)
      .snapshotChanges()
      .pipe(
        map(actions => {
          console.log('in here');
          return actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          })) as Board[];
        }),
        shareReplay(1)
      );

    this.board$ = this.activatedRoute.params.pipe(
      switchMap(({id}) =>
        // TODO: Source from database
        // this.afs
        //   .collection(FirestoreCollections.Board)
        //   .doc(id)
        //   .valueChanges()
        of({
          panels: [
            {
              type: PanelType.MemberPush,
              layout: {
                colStart: 1,
                colSpan: 2,
                rowStart: 1,
                rowSpan: 1
              },
              metadata: {}
            }
          ]
        }).pipe(
          map((board: Board) =>
            board.panels.map(panel => ({
              panel,
              portal: new ComponentPortal(panelMap[panel.type])
            }))
          )
        )
      )
    );
  }
}
