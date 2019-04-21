import {PanelType} from '../enums/panel-type.enum';

export interface Panel {
  type: PanelType;
  layout: {
    order: number;
    width: string;
  };
  metadata: any;
}
