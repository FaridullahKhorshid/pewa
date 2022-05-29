import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from "./shared/components/error-page/error-page.component";

const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule)},
  {path: 'tetris', loadChildren: () => import('./modules/tetris/tetris.module').then((m) => m.TetrisModule)},
  {path: 'account', loadChildren: () => import('./modules/account/account.module').then((m) => m.AccountModule)},
  {path: 'ranking', loadChildren: () => import('./modules/ranking/ranking.module').then((m) => m.RankingModule)},
  {path: 'login', loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)},
  {path: 'sign-out', redirectTo: '/login?signOut=1'},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
