import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './pages/board/board.component';
import {LoginComponent} from './pages/login/login.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoginGuard} from './shared/guards/login.guard';

const routes: Routes = [
  {
    path: 'board/:id',
    component: BoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '**',
    redirectTo: 'board/1'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
