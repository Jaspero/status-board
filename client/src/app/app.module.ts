import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './pages/board/board.component';
import {MemberPushPanelComponent} from './pages/board/panels/member-push-panel/member-push-panel.component';
import {LoginComponent} from './pages/login/login.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {AddPanelsComponent} from './shared/components/add-panels/add-panels.component';
import {ConfirmationComponent} from './shared/components/confirmation/confirmation.component';
import {MembersComponent} from './shared/components/members/members.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {ENV_CONFIG} from './shared/consts/env-config.const';
import {BoardSettingsComponent} from './shared/components/board-settings/board-settings.component';

const ENTRY_COMPONENTS = [
  MemberPushPanelComponent,
  MembersComponent,
  ProfileComponent,
  AddPanelsComponent,
  ConfirmationComponent,
  BoardSettingsComponent
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LoginComponent,
    ResetPasswordComponent,

    ...ENTRY_COMPONENTS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    /**
     * External
     */
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    PortalModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    DragDropModule,

    LoadClickModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: ENTRY_COMPONENTS
})
export class AppModule {}
