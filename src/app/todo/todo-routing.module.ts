import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo.component';
import { HomeComponent } from './home/home.component';
import { TodoDetailsComponent } from './home/todo-details/todo-details.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  // { path: '', component: TodoComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'todoList', component: TodoComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'home/todo', component: TodoDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
