import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TetrisComponent} from './tetris.component';
import {TetrisRoutingModule} from "./tetris-routing.module";
import {RulesComponent} from './rules/rules.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CreateComponent } from './create/create.component';
import {FormsModule} from "@angular/forms";
import { PracticeComponent } from './practice/practice.component';


@NgModule({
  declarations: [
    TetrisComponent,
    RulesComponent,
    LobbyComponent,
    CreateComponent,
    PracticeComponent,
  ],
    imports: [
        CommonModule,
        TetrisRoutingModule,
        FormsModule
    ]
})
export class TetrisModule {
}
