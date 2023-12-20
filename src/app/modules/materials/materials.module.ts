import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsRoutingModule } from './materials-routing.module';
import { RolledComponent } from './components/rolled/rolled.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [RolledComponent],
  imports: [
    CommonModule,
    MaterialsRoutingModule,
    FormsModule
    ],
  providers:[],
})
export class MaterialsModule {

 }
