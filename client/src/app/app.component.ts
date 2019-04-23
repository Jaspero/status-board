import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {MembersComponent} from './shared/components/members/members.component';
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
    private dialog: MatDialog
  ) {}

  mode$: Observable<string>;

  ngOnInit() {
    this.mode$ = this.state.editMode$.pipe(
      map(value => (value ? 'Display' : 'Edit'))
    );
  }

  logOut() {
    this.afAuth.auth.signOut();
  }

  openDialog(type: string) {
    const dialogMap = {
      profile: ProfileComponent,
      members: MembersComponent
    };

    this.dialog.open(dialogMap[type], {width: '800px'});
  }
}
