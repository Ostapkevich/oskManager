import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewDrawingsComponent } from './view-drawings/view-drawings.component';

const routes: Routes = [
  {path:'drawings', component:ViewDrawingsComponent, canDeactivate:[] },
 
  
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
