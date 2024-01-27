import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolledComponent } from './rolled/rolled.component'; 
import { HardwareComponent } from './hardware/hardware.component';
import { OthersComponent } from './others/others.component';
import { PurchasedComponent } from './purchased/purchased.component';
import { TypeMaterialComponent } from './type-material/type-material.component';

const routes: Routes = [
  {path:'rolled', component:RolledComponent, canDeactivate:[] },
  {path:'hardware', component:HardwareComponent, canDeactivate:[] },
  {path:'others', component:OthersComponent, canDeactivate:[] },
  {path:'purchased', component:PurchasedComponent, canDeactivate:[] },
  {path:'types', component:TypeMaterialComponent, canDeactivate:[] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsRoutingModule { }
