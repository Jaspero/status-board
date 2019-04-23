import {Panel} from './panel.interface';

export interface Board {
  id: string;
  name: string;
  panels: Panel[];
  order: number;
}
