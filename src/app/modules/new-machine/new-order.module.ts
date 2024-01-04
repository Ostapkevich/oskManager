import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { NewOrderRoutingModule }from './new-order-routing.module';
import { EditUnitsComponent } from './components/edit-units/edit-units.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NewOrderRoutingModule
     ],
  declarations: [NewOrderComponent, EditUnitsComponent],
  providers:[],
  
})
export class NewOrderModule {
  
 }
