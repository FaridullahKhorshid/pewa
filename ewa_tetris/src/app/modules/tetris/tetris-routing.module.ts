import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RulesComponent} from './rules/rules.component';
import {TetrisComponent} from './tetris.component';
import {LobbyComponent} from "./lobby/lobby.component";
import {CreateComponent} from "./create/create.component";
import {AuthGuard} from "../../shared/services/auth.guard";
import {PracticeComponent} from "./practice/practice.component";

const routes: Routes = [
  {path: '', component: LobbyComponent},
  {
    path: 'play/:id', component: TetrisComponent,
    canActivate: [AuthGuard]
  },
  {path: 'rules', component: RulesComponent},
  {
    path: 'practice/:id', component: PracticeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create', component: CreateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TetrisRoutingModule {
}
