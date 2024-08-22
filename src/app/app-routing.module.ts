import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListPageComponent } from "@app/clients/pages/clients-list-page/clients-list-page.component";

const routes: Routes = [
  {
    path: '',
    title: 'Клиенты',
    component: ClientsListPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
