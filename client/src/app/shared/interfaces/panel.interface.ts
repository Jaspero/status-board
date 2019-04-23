import {PanelType} from '../enums/panel-type.enum';

export interface Panel {
  type: PanelType;
  layout: {
    colStart: number;
    colSpan: number;
    rowStart: number;
    rowSpan: number;
  };
  metadata: any;
}
