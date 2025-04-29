import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePdvComponent } from './pages/home-pdv/home-pdv.component';

const routes: Routes = [
  {
    path: '',
    component: HomePdvComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
