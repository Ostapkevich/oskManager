import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';


const routes: Routes = [
 {path:'', component:HomeComponent } ,
 {path:'instruments', loadChildren:()=>import('./modules/new-machine/new-order-routing.module').then((m)=>m.NewOrderRoutingModule)},
 {path:'materials', loadChildren:()=>import('./modules/materials/materials-routing.module').then((m)=>m.MaterialsRoutingModule)},
 {path:'views', loadChildren:()=>import('./modules/views/views-routing.module').then((m)=>m.ViewsRoutingModule)},
 { path: 'viewDrawing', component: PdfViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,
 ],
 
})
export class AppRoutingModule { } 
