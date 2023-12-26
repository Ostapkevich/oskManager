import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsRoutingModule } from './materials-routing.module';
import { RolledComponent } from './components/rolled/rolled.component';
import { FormsModule } from '@angular/forms';
import { HardwareComponent } from './components/hardware/hardware.component';


@NgModule({
  declarations: [RolledComponent, HardwareComponent],
  imports: [
    CommonModule,
    MaterialsRoutingModule,
    FormsModule
    ],
  providers:[],
})
export class MaterialsModule {

 }
