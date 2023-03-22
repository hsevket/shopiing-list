import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { MainListComponent } from './main-list/main-list.component';


const routes: Routes = [
  
  {path:'lists/:id', component:ListDetailComponent},
  {path:'', redirectTo:'/lists', pathMatch:'full'},
  {path:'lists', component: MainListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
