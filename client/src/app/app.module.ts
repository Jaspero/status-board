import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './pages/board/board.component';
import {MemberPushPanelComponent} from './pages/board/panels/member-push-panel/member-push-panel.component';
import {LoginComponent} from './pages/login/login.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {MembersComponent} from './shared/components/members/members.component';
import {ENV_CONFIG} from './shared/consts/env-config.const';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

const ENTRY_COMPONENTS = [
  MemberPushPanelComponent,
  MembersComponent,
  ProfileComponent
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

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: ENTRY_COMPONENTS
})
export class AppModule {}
