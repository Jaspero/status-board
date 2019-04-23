import {ComponentPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {PanelType} from '../../shared/enums/panel-type.enum';
import {Width} from '../../shared/enums/width.enum';
import {Board} from '../../shared/interfaces/board.interface';
import {Panel} from '../../shared/interfaces/panel.interface';
import {MemberPushPanelComponent} from './panels/member-push-panel/member-push-panel.component';

@Component({
  selector: 'jgb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  board$: Observable<
    Array<{
      panel: Panel;
      portal: ComponentPortal<any>;
    }>
  >;

  ngOnInit() {
    const panelMap = {
      [PanelType.MemberPush]: MemberPushPanelComponent
    };

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
