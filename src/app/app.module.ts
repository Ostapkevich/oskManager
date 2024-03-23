import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PlanComponent } from './modules/plan/orders/plan.component';






@NgModule({
  declarations: [
    AppComponent,
    PlanComponent,
    
  
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
   
  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
