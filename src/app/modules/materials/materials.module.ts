import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsRoutingModule } from './materials-routing.module';
import { RolledComponent } from './components/rolled/rolled.component';
import { MaterialService } from './material.service';


@NgModule({
  declarations: [RolledComponent],
  imports: [
    CommonModule,
    MaterialsRoutingModule,
    ],
  providers:[MaterialService],
})
export class MaterialsModule {

 }
