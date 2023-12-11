import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsRoutingModule } from './materials-routing.module';
import { RolledComponent } from './components/rolled/rolled.component';



@NgModule({
  declarations: [RolledComponent],
  imports: [
    CommonModule,
    MaterialsRoutingModule,
   
  ]
})
export class MaterialsModule { }
