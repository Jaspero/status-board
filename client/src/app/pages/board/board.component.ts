import {moveItemInArray} from '@angular/cdk/drag-drop';
import {ComponentPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, forkJoin, from, Observable} from 'rxjs';
import {map, switchMap, shareReplay, take} from 'rxjs/operators';
import {FirestoreCollections} from '../../../../../shared/enums/firestore-collections.enum';
import {AddPanelsComponent} from '../../shared/components/add-panels/add-panels.component';
import {PanelType} from '../../shared/enums/panel-type.enum';
import {Board} from '../../shared/interfaces/board.interface';
import {Panel} from '../../shared/interfaces/panel.interface';
import {StateService} from '../../shared/services/state/state.service';
import {confirmation} from '../../shared/utils/confirmation';
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
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) {}

  panels$: Observable<
    Array<{
      panel: Panel;
      portal: ComponentPortal<any>;
    }>
  >;

  board$: Observable<Board>;
  boards$: Observable<Board[]>;
  grid$: Observable<Array<boolean[]>>;

  ngOnInit() {
    const panelMap = {
      [PanelType.MemberPush]: MemberPushPanelComponent
    };

    this.boards$ = this.afs
      .collection(FirestoreCollections.Boards, ref =>
        ref.orderBy('order', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map(
          actions =>
            actions.map(action => ({
              id: action.payload.doc.id,
              ...action.payload.doc.data()
            })) as Board[]
        ),
        shareReplay(1)
      );

    this.board$ = this.boards$.pipe(
      switchMap(boards =>
        this.activatedRoute.params.pipe(
          map(({id}) => boards.find(board => board.id === id))
        )
      )
    );

    this.panels$ = this.board$.pipe(
      map(board => {
        if (!board) {
          return [];
        }

        return board.panels.map(panel => ({
          panel,
          portal: new ComponentPortal(panelMap[panel.type])
        }));
      })
    );

    this.grid$ = this.panels$.pipe(
      map(panels => {
        const grid = [
          [false, false, false, false],
          [false, false, false, false],
          [false, false, false, false],
          [false, false, false, false]
        ];

        panels.forEach(panel => {
          for (
            let rowIndex = panel.panel.layout.rowStart;
            rowIndex < panel.panel.layout.rowStart + panel.panel.layout.rowSpan;
            rowIndex++
          ) {
            for (
              let colIndex = panel.panel.layout.colStart;
              colIndex <
              panel.panel.layout.colStart + panel.panel.layout.colSpan;
              colIndex++
            ) {
              grid[rowIndex][colIndex] = true;
            }
          }
        });

        return grid;
      })
    );
  }

  addBoard() {
    this.boards$
      .pipe(
        take(1),
        switchMap(boards => {
          const order = boards.length ? boards.length + 1 : 1;

          return this.afs
            .collection(FirestoreCollections.Boards)
            .doc(order.toString())
            .set({
              panels: [],
              order,
              name: `Board ${order}`
            });
        })
      )
      .subscribe();
  }

  removeBoard(board) {
    confirmation(
      [
        switchMap(() =>
          this.afs
            .collection(FirestoreCollections.Boards)
            .doc(board.id)
            .delete()
        )
      ],
      {
        header: `Remove ${board.name}?`,
        confirm: 'Remove',
        negate: 'Cancel'
      }
    );
  }

  sortBoards(event, boards: Board[]) {
    const previousBoard = boards.find(
      board => board.order === event.currentIndex + 1
    );

    moveItemInArray(boards, event.previousIndex, event.currentIndex);

    forkJoin(
      from(
        this.afs
          .collection(FirestoreCollections.Boards)
          .doc(previousBoard.id)
          .set(
            {
              order: event.item.data.order
            },
            {merge: true}
          )
      ),
      from(
        this.afs
          .collection(FirestoreCollections.Boards)
          .doc(event.item.data.id)
          .set(
            {
              order: previousBoard.order
            },
            {merge: true}
          )
      )
    ).subscribe();
  }

  openPanelDialog() {
    combineLatest(this.boards$, this.board$, this.grid$)
      .pipe(
        take(1),
        switchMap(([boards, board, grid]) =>
          this.dialog
            .open(AddPanelsComponent, {
              width: '700px',
              data: {boards, board, grid}
            })
            .afterClosed()
        )
      )
      .subscribe();
  }

  removePanel(index: number) {
    confirmation([
      switchMap(() => this.board$),
      take(1),
      switchMap((board: Board) => {
        const panels = [...board.panels];

        panels.splice(index, 1);

        return this.afs
          .collection(FirestoreCollections.Boards)
          .doc(board.id)
          .set(
            {
              panels
            },
            {merge: true}
          );
      })
    ]);
  }
}
