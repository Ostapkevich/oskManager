import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { EditUnitsComponent} from './edit-units/edit-units.component';
import { exitNewOrder } from './new-order/exitNewOrder.guard';
import { DrawingsDatabaseComponent } from './drawings-database/drawings-database.component';
const routes: Routes = [
 {path:'newOrder', component:NewOrderComponent, canDeactivate:[exitNewOrder] },
 {path:'formOrder', component:EditUnitsComponent},
 {path:'drawingsDatabase', component:DrawingsDatabaseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
 
 
})
export class NewOrderRoutingModule { }
