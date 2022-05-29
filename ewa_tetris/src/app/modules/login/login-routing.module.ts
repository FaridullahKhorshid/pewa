import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'sign-up', component: CreateAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
