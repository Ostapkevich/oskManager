import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolledComponent } from './components/rolled/rolled.component'; 
import { HardwareComponent } from './components/hardware/hardware.component';


const routes: Routes = [
  {path:'rolled', component:RolledComponent, canDeactivate:[] },
  {path:'hardware', component:HardwareComponent, canDeactivate:[] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsRoutingModule { }
