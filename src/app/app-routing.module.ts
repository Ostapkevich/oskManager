import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';



const routes: Routes = [
 {path:'', component:HomeComponent } ,
 {path:'instruments', loadChildren:()=>import('./modules/new-machine/new-order.module').then((m)=>m.NewOrderModule)},
 {path:'materials', loadChildren:()=>import('./modules/materials/materials.module').then((m)=>m.MaterialsModule)},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,
 ],
 
})
export class AppRoutingModule { } 
