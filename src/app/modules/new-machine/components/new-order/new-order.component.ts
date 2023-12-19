import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Icategorycastomer, Iorder, IProperties, Icategories, Icustomers } from './iNewOrderInterfase';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-new-machine',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [],

})
export class NewOrderComponent implements OnInit {

  constructor(private appService: AppService) {

  }

  dataChanged: boolean | null | undefined = false;
  customers: Icustomers[] | undefined;
  categories: Icategories[] | undefined;
  dataProperties: Array<IProperties> = [];
  dataOrder!: Iorder | undefined;


  @ViewChild("orderform", { static: false })
  orderform: NgForm | undefined;

  formChange(dataForm: NgForm) {
    this.dataChanged = dataForm.dirty;
  }

  clean() {
    if (this.dataChanged === true) {
      if (confirm("Данные не сохранены! Очистить форму?") === false) {
        return;
      }
    }
    if (this.dataOrder && (this.dataOrder as Object).hasOwnProperty('order_machine') === true) {
      delete (this.dataOrder.order_machine);
    }
    this.orderform?.reset();
    this.initialization(false);
    this.dataChanged = false;

  }

  async getNewOrder($event: KeyboardEvent, id: string) {
    try {
      if ($event.key !== 'Enter') {
        return;
      } else if (id === "") {
        return;
      }
      await this.loadOrder(id, 'false');
    } catch (error) {
      alert(error);
    }
  }


  getAnalogOrder() {
    const analogOrder = prompt("Введите номер заказа аналога");
    if (analogOrder === "" || analogOrder === null) {
      return
    }
    this.loadOrder(analogOrder, 'true');

  }


  async loadOrder(id: string, isAnalog: 'false' | 'true') {
    try {
      const data: { order: Iorder, properties: IProperties[] } = await this.appService.query('get', `http://localhost:3000/newOrder/loadOrder${id}/${isAnalog}`);
      if ((data as Object).hasOwnProperty('order') === false) {
        alert("Данный заказ закрыт или не существует!");
        return;
      }
      if (isAnalog === 'true') {
        if ((this.dataOrder as Object).hasOwnProperty('order_machine')) {
          const order_machine = this.dataOrder!.order_machine
          const idcustomer = this.dataOrder!.idcustomer;
          const shipment = this.dataOrder!.shipment;
          this.dataOrder = data.order;
          this.dataOrder!.order_machine = order_machine;
          this.dataOrder!.idcustomer = idcustomer;
          this.dataOrder!.shipment = shipment;
        } else {
          this.dataOrder = data.order;
          this.dataOrder!.idcustomer = 0;
          this.dataOrder!.shipment = new Date().toISOString().split('T')[0];
        }
        this.dataChanged = true;
      }
      else {
        this.dataOrder = data.order;
        this.dataChanged = false;
      }
      if ((data as Object).hasOwnProperty('properties')) {
        let i = 0;
        for (const iterator of data.properties) {
          this.dataProperties[i] = iterator;
          i++;
        }
        for (i = i; i < 14; i++) {
          this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async save(btn: string) {
    if (this.orderform?.invalid === true) {
      alert('Заполните обязательные поля! Поле с массой должно содержать только цифры с точкой.');
      return;
    }
    if (this.dataChanged === false) {
      return;
    }
    try {
      let oldNameOrder: string;
      let method: 'put' | 'post';
      let url: string;
      const formValue = this.orderform!.value;
      if (formValue.shipment !== "" && Date.parse(formValue.shipment) < Date.now()) {
        if (confirm('Дата отгрузки должна быть больше текущей даты. Изменить дату отгрузки?') === true) {
          return;
        }
      } else if (formValue.shipment === "") {
        formValue.shipment = null;
      }
      if (btn === 'btnSave') {
        oldNameOrder = this.dataOrder?.order_machine!;
        method = 'put';
        url = 'http://localhost:3000/newOrder/saveOrder';
        if (this.dataOrder?.order_machine !== formValue.order_machine && !confirm("Хотите изменить номер заказа?")) {
          return;
        }
      } else {
        oldNameOrder = '';
        method = 'post';
        url = 'http://localhost:3000/newOrder/createOrder';
      }
      const props: Array<IProperties> = [];
      for (let i = 0; i < 14; i++) {
        if (formValue[`char${i}`] !== "") {
          props.push({ order_machine: formValue.order_machine, property: formValue[`char${i}`], val: formValue[`val${i}`] });
        }
      }
      const dataServer = {
        mainData:
        {
          order_machine: formValue.order_machine,
          number_machine: formValue.number_machine,
          name_machine: formValue.name_machine,
          description: formValue.description,
          idcustomer: (document.getElementById('cust') as HTMLSelectElement).value,
          idcategory: (document.getElementById('cat') as HTMLSelectElement).value,
          weight: formValue.weight,
          shipment: formValue.shipment,
          oldNameOrder: oldNameOrder
        },
        insertProps: props
      }

      const data = await this.appService.query(method, url, dataServer);
      if (data.response === 'ok') {
        alert('Даные сохранены!');
        this.loadOrder(formValue.order_machine, 'false');
      } else if (data.response === 'notUpdated') {
        alert(`Заказ с номером ${formValue.order_machine} уже существует`);
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }

    } catch (error) {
      alert(error);
    }
  }

  initialization(isOnload: boolean) {
    this.dataProperties.length = 0;
    for (let index = 0; index < 14; index++) {
      this.dataProperties.push({ property: "", val: "", idproperty: 0 })
    }
    const valueDate = new Date().toISOString().split('T')[0];
    if (isOnload) {
      this.dataOrder = { idcategory: 0, idcustomer: 0, shipment: valueDate };
    } else {
      (document.getElementById('cat') as HTMLSelectElement).value = '0';
      (document.getElementById('cust') as HTMLSelectElement).value = '0';
      (document.getElementById('plane') as HTMLDataElement).value = valueDate;
    }

  }


  async loadCatCust() {
    try {
      const data: Icategorycastomer = await this.appService.query('get', 'http://localhost:3000/newOrder/selectcustcat');
      if ((data as Object).hasOwnProperty('customers')) {
        this.customers = data.customers;
      }
      if ((data as Object).hasOwnProperty('categories')) {
        this.categories = data.categories;
      }

    } catch (error) {
      alert(error)
    }
  }


  ngOnInit() {
    this.loadCatCust();
    this.initialization(true);
    let event = new Event("click");
    document.getElementById('id_machine')!.dispatchEvent(event);
  }

  check() {
    console.clear();
    console.log('pristine: ', this.orderform?.pristine)
    console.log('touched: ', this.orderform?.touched)
    console.log('untouched: ', this.orderform?.untouched)
    console.log('dirty: ', this.orderform?.dirty)
    console.log('invalid: ', this.orderform?.invalid)
  }

}











