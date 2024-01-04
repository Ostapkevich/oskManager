import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { EditUnitsComponent} from './components/edit-units/edit-units.component';
import { exitNewOrder } from './components/new-order/exitNewOrder.guard';
import { DrawingsDatabaseComponent } from './components/drawings-database/drawings-database.component';
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
