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
  MatSnackBarModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './pages/board/board.component';
import {MemberPushPanelComponent} from './pages/board/panels/member-push-panel/member-push-panel.component';
import {LoginComponent} from './pages/login/login.component';
import {MemberComponent} from './pages/member/member.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {ENV_CONFIG} from './shared/consts/env-config.const';

const ENTRY_COMPONENTS = [MemberPushPanelComponent];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    BoardComponent,
    MemberComponent,
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
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: ENTRY_COMPONENTS
})
export class AppModule {}
