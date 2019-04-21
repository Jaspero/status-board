import {Role} from '../enums/role.enum';

export interface Settings {
  members: Array<{email: string; role: Role}>;
}
