import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BoardSettingsComponent} from './shared/components/board-settings/board-settings.component';
import {MembersComponent} from './shared/components/members/members.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {StateService} from './shared/services/state/state.service';

@Component({
  selector: 'jgb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    public state: StateService,
    public afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router
  ) {}

  mode$: Observable<string>;

  ngOnInit() {
    this.mode$ = this.state.editMode$.pipe(
      map(value => (value ? 'Display' : 'Edit'))
    );
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  openDialog(type: string) {
    const dialogMap = {
      profile: ProfileComponent,
      members: MembersComponent,
      board: BoardSettingsComponent
    };

    this.dialog.open(dialogMap[type], {width: '800px'});
  }
}
