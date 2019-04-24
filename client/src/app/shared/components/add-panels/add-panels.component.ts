import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {from} from 'rxjs';
import {FirestoreCollections} from '../../../../../../shared/enums/firestore-collections.enum';
import {PANELS} from '../../consts/panels.const';
import {Board} from '../../interfaces/board.interface';

@Component({
  selector: 'jgb-add-panels',
  templateUrl: './add-panels.component.html',
  styleUrls: ['./add-panels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPanelsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      board: Board;
      grid: Array<boolean[]>;
      boards: Board[];
    },
    private afs: AngularFirestore,
    private dialogRef: MatDialogRef<AddPanelsComponent>
  ) {}

  panels = PANELS;

  freePosition(panel) {
    const toCheckRows = Math.ceil(4 / panel.layout.rowSpan);
    const toCheckCols = Math.ceil(4 / panel.layout.colSpan);

    let found;

    for (let rowIndex = 0; rowIndex < toCheckRows; rowIndex++) {
      for (
        let freeRowSpot = 0;
        freeRowSpot < panel.layout.rowSpan;
        freeRowSpot++
      ) {
        for (let colIndex = 0; colIndex < toCheckCols; colIndex++) {
          for (
            let freeColSpot = 0;
            freeColSpot < panel.layout.colSpan;
            freeColSpot++
          ) {
            if (
              this.data.grid[rowIndex + freeRowSpot][colIndex + freeColSpot]
            ) {
              found = null;
            } else {
              found = {
                rowStart: rowIndex,
                colStart: colIndex
              };
            }
          }

          if (found) {
            return found;
          }
        }
      }
    }

    return found;
  }

  add(panel) {
    const position: any = this.freePosition(panel);

    let id: string;
    let toSet: any;

    if (position && this.data.board) {
      id = this.data.board.id;
      toSet = {
        panels: [
          ...this.data.board.panels,
          {
            type: panel.type,
            layout: {
              colSpan: panel.layout.colSpan,
              rowSpan: panel.layout.rowSpan,
              colStart: position.colStart,
              rowStart: position.rowStart
            },
            metadata: {}
          }
        ]
      };
    } else {
      const order = this.data.boards.length + 1;

      id = order.toString();
      toSet = {
        panels: [
          {
            type: panel.type,
            layout: {
              colSpan: panel.layout.colSpan,
              rowSpan: panel.layout.rowSpan,
              colStart: 0,
              rowStart: 0
            },
            metadata: {}
          }
        ],
        order,
        name: `Board ${order}`
      };
    }

    from(
      this.afs
        .collection(FirestoreCollections.Boards)
        .doc(id)
        .set(toSet, {merge: true})
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
