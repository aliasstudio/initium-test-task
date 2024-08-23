import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListPageComponent } from "@app/clients/pages/clients-list-page/client-list-page.component";

const routes: Routes = [
  {
    path : '**' ,
    redirectTo : '' ,
    pathMatch : 'full'
  },
  {
    path: '',
    title: 'Клиенты',
    component: ClientListPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
