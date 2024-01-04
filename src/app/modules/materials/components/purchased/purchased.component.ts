import { OthersComponent } from "../others/others.component";
import { AddOthersComponent } from "../add-others/add-others.component";
import { AppService } from "src/app/app.service";
import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone:true,
    imports:[AddOthersComponent, FormsModule, CommonModule],
    selector: 'app-purchased',
    templateUrl: '../others/others.component.html'
  })
export class PurchasedComponent extends OthersComponent {
    constructor(protected override appService: AppService) {
        super(appService);
        this.namePage='Покупные изделия';
        this.nameController='purchased';
        
    }

}