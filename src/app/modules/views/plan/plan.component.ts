import { Component, ViewChild, ElementRef, OnInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Iplan } from './interface_plan';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';

@Component({
  standalone: true,
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
  imports: [FormsModule, CommonModule]
})
export class PlanComponent implements OnInit, DoCheck {
  constructor(private appService: AppService) { }

  orders: Iplan[] = [];
  idOrder: number | undefined;
  drawingNamber: string = '';
  drawingName: string = '';
  hasScroll: boolean = false;
  orderNavigator: TableNavigator | undefined;
  @ViewChild('divOrder') divElement!: ElementRef;

  inputEnter(event?: any) {
    if (event?.key === 'Enter') {
      const idElem = document.getElementById('idDrawing');
      const numberElem = document.getElementById('numberDrawing');
      let data: any;
      if (event?.target === numberElem) {
        const number = (numberElem as HTMLInputElement).value;
        //this.getDrawingInfoFull(number, 'number');
      } else {
        const id = +(idElem as HTMLInputElement).value
        // this.getDrawingInfoFull(id, 'id');
      }
      //this.dataChanged = false;
    }
  }


  async getOrders(typeOrder: number | boolean) {
    try {
      let data: any;
      data = await this.appService.query('get', `http://localhost:3000/viewPlan/:${typeOrder}/0`);
      this.orders.length = 0;
      console.log(data)
      if (data.length > 0) {
        this.orders = data;
      } else {
        alert('Заказ не найден!');
      }
    } catch (error) {
      alert(error);
    }
  }

  ngDoCheck(): void {
    if (this.divElement) {
    const element = this.divElement.nativeElement as HTMLDivElement;
    this.hasScroll = element.scrollHeight > element.clientHeight;
  }
  }

  async ngOnInit() {
    let event = new Event("click");
    document.getElementById('numberOrder')!.dispatchEvent(event);
    this.orderNavigator = new TableNavigator((document.getElementById('tblOrders') as HTMLTableElement), 0)
    await this.getOrders(true);
  }

}
