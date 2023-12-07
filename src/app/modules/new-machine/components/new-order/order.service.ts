import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable(
 
)
export class OrderService {

  constructor(private httpNewOrder: HttpClient) { }

  createOrder(formData: any) {
    return this.httpNewOrder.post('http://localhost:3000/newOrder/new', formData);
  }

  saveEditedOrder(formData: any ) {
        return this.httpNewOrder.put(`http://localhost:3000/newOrder/edit`, formData);
      }

  loadNewOrder(id: string) {
    return this.httpNewOrder.get(`http://localhost:3000/newOrder/load-newOrder-${id}`);
  }

  loadAnalogOrder(id: string) {
    return this.httpNewOrder.get(`http://localhost:3000/newOrder/load-analogOrder-${id}`);
  }

  getOrderDescription(id: string) {
    return this.httpNewOrder.get(`http://localhost:3000/newOrder/machine-description-${id}`)
  }

  loadCustCat() {
    return this.httpNewOrder.get('http://localhost:3000/newOrder/selectcustcat');
  }
}
