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
     this.orderform?.reset();
     this.dataOrder=undefined;
    this.dataProperties.length = 0;
    for (let index = 0; index < 14; index++) {
      this.dataProperties.push({ property: "", val: "", idproperty: 0 })
    }
    if ((document.getElementById('cat') as HTMLSelectElement).length > 0) {
      (document.getElementById('cat') as HTMLSelectElement).selectedIndex = 0;
    }
    if ((document.getElementById('cust') as HTMLSelectElement).length > 0) {
      (document.getElementById('cust') as HTMLSelectElement).selectedIndex = 0;
    }
    (document.getElementById('plane') as HTMLDataElement).value = new Date().toISOString().split('T')[0];
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
        if ( this.dataOrder && (this.dataOrder as Object).hasOwnProperty('order_machine') === true ) {
          const order_machine = this.dataOrder!.order_machine
          const idcustomer = this.dataOrder!.idcustomer;
          const shipment = this.dataOrder!.shipment;
          this.dataOrder = data.order;
          this.dataOrder!.order_machine = order_machine;
          this.dataOrder!.idcustomer = idcustomer;
          this.dataOrder!.shipment = shipment;
        } else {
          this.dataOrder = data.order;
        }
        (document.getElementById('cat') as HTMLSelectElement).value = String(this.dataOrder.idcategory);
        this.dataChanged = true;
      }
      else {
        this.dataOrder = data.order;
        this.dataChanged = false;
        (document.getElementById('cat') as HTMLSelectElement).value = String(this.dataOrder.idcategory);
        (document.getElementById('cust') as HTMLSelectElement).value = String(this.dataOrder.idcustomer);
        (document.getElementById('plane') as HTMLDataElement).value = this.dataOrder.shipment!;
      }
      if ((data as Object).hasOwnProperty('properties')) {
        this.dataProperties = data.properties;
        let i: number;
        for (i = this.dataProperties.length; i < 14; i++) {
          this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async save(btn: string) {
    if ((document.getElementById('cat') as HTMLSelectElement).length === 0 || (document.getElementById('cust') as HTMLSelectElement).length === 0) {
      alert("Добавте категории и заказчиков!");
      return;
    }
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
        if (formValue[`char${i}`] !== "" && formValue[`char${i}`] !== null ) {
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
          shipment: (document.getElementById('plane') as HTMLDataElement).value,
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


  async onLoad() {
    try {
      for (let index = 0; index < 14; index++) {
        this.dataProperties.push({ property: "", val: "", idproperty: 0 })
      }
      const data: Icategorycastomer = await this.appService.query('get', 'http://localhost:3000/newOrder/selectcustcat');
      if ((data as Object).hasOwnProperty('customers')) {
        this.customers = data.customers;
        (document.getElementById('cust') as HTMLSelectElement).selectedIndex = 0;
      }
      if ((data as Object).hasOwnProperty('categories')) {
        this.categories = data.categories;
        (document.getElementById('cat') as HTMLSelectElement).selectedIndex = 0;
      }
      (document.getElementById('plane') as HTMLDataElement).value = new Date().toISOString().split('T')[0];
     
    } catch (error) {
      alert(error)
    }
  }


  ngOnInit() {
    this.onLoad();
    let event = new Event("click");
    document.getElementById('id_machine')!.dispatchEvent(event);
  }



}











