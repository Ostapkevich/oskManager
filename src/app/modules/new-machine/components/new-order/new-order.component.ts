import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
//import { Subscription } from 'rxjs';
import { Icategorycastomer, Iorder, IProperties, Icategories, Icustomers } from './iNewOrderInterfase';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-new-machine',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [],

})
export class NewOrderComponent implements OnInit {


  constructor(private router: Router, private activateRoute: ActivatedRoute, private appService: AppService) {
    /*  this.newOrder = activateRoute.snapshot.params['newOrder'];
     this.subscription = activateRoute.params.subscribe(
       (params) => (this.newOrder = params['newOrder']));
  */

  }
  // private subscription: Subscription;
 // isNewOrde = true;
  customerOnload: number | undefined;
  categoryOnload: number | undefined;
  dataChanged: boolean | null | undefined = false;
  customers: Icustomers[] | undefined;
  categories: Icategories[] | undefined;
  dataProperties: Array<IProperties> = [];
  dataOrder!: Iorder | undefined;


  @ViewChild("templateCustomer", { static: false })
  customerRef: ElementRef | undefined;

  @ViewChild("templateCategory", { static: false })
  categoryRef: ElementRef | undefined;

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
    this.dataOrder = undefined;
    this.orderform?.reset();
    this.dataChanged = false;
  }

  getNewOrder($event: KeyboardEvent, id: string) {
    try {
      if ($event.key !== 'Enter') {
        return;
      } else if (id === "") {
        return;
      }
      this.loadOrder(id, 'false');
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
      if (!data.order) {
        alert("Данный заказ закрыт или не существует!");
        return;
      }
      /*    if (data.order.description === null) {
           data.order.description = "";
         } */
      const order = this.dataOrder?.order_machine;
      const shipment = this.dataOrder?.shipment;
      this.dataOrder = data.order;
      if (data.properties) {
        this.dataProperties = data.properties;
      }
      if (isAnalog === 'true') {
        if (order) {
          this.dataOrder!.order_machine = order;
        }
        if (shipment) {
          this.dataOrder!.shipment = shipment;
        }
      }
      this.categoryOnload = this.dataOrder?.idcategory;
      let select: HTMLSelectElement;
      let options: any;
      if (isAnalog === 'false') {
        this.customerOnload = this.dataOrder?.idcustomer;
        let inputDate: any;
        inputDate = document.getElementById("plane");
        inputDate.value = this.dataOrder?.shipment;
        select = this.customerRef?.nativeElement;
        options = select.children;
        const len = options.length;
        for (let i = 0; i < len; i++) {
          if (+options[i].value === this.dataOrder?.idcustomer) {
            select.options[i].selected = true;
            break;
          }
        }
      }
      select = this.categoryRef?.nativeElement;
      options = select.children;
      const len = options.length;
      for (let i = 0; i < len; i++) {
        if (+options[i].value === this.dataOrder?.idcategory) {
          select.options[i].selected = true;
          break;
        }
      }
      let i = 0;
      for (const iterator of data.properties) {
        this.dataProperties[i] = iterator;
        i++;
      }
      for (i = i; i < 14; i++) {
        this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
      }
      if (isAnalog === 'true') {
        this.dataChanged = true;
      } else {
        this.dataChanged = false;
      }

    } catch (error) {
      alert(error);
    }
  }

  async createOrder(dataForm: any, shipment: any) {
    if (this.orderform?.invalid === true) {
      alert('Заполните обязательные поля!');
      return;
    }
    if (this.dataChanged === false) {
      return;
    }
    try {

      if (shipment !== "" && Date.parse(shipment) < Date.now()) {
        if (confirm('Дата отгрузки должна быть больше текущей даты. Изменить дату отгрузки?') === true) {
          return;
        }
      } else if (shipment === "") {
        dataForm.shipment = null;
      }
      if (!dataForm.idcategory || !dataForm.idcustomer) {
        alert("Выберите заказчика и категорию!");
        return;
      }
      
      const data = await this.appService.query('post', 'http://localhost:3000/newOrder/createOrder', dataForm);
      if (data.response === 'ok') {
        this.dataChanged = false;
      //  this.isNewOrde = false;
        this.loadOrder(dataForm.order_machine, 'false');
        alert("Даные сохранены!");
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

  async save(btn:string) {
    if (this.orderform?.invalid === true) {
      alert('Заполните обязательные поля!');
      return;
    }
    if (this.dataChanged === false) {
      return;
    }
    try {
      let  oldNameOrder:string;
      let method:'put'|'post';
      let url:string;
      const formValue=this.orderform!.value;
      if (formValue.shipment !== "" && Date.parse(formValue.shipment) < Date.now()) {
        if (confirm('Дата отгрузки должна быть больше текущей даты. Изменить дату отгрузки?') === true) {
          return;
        }
      } else if (formValue.shipment === "") {
        formValue.shipment = null;
      }
      if (btn==='btnSave') {
        oldNameOrder=this.dataOrder?.order_machine!;
        method='put';
        url='http://localhost:3000/newOrder/saveOrder';
           if (this.dataOrder?.order_machine !== formValue.order_machine && !confirm("Хотите изменить номер заказа?")) {
          return;
        }
      }else{
        oldNameOrder='';
        method='post';
        url='http://localhost:3000/newOrder/createOrder';
        if (!formValue.idcategory || !formValue.value.idcustomer) {
          alert("Выберите заказчика и категорию!");
          return;
        }
      }
      const props: Array<IProperties> = [];
      for (let i = 0; i < 14; i++) {
        if (formValue[`char${i}`] !== "") {
          props.push({ order_machine: formValue.order_machine, property: formValue[`char${i}`], val: formValue[`val${i}`] });
        }
      }
      const dataServer= {
        mainData:
        {
          order_machine: formValue.order_machine,
          number_machine: formValue.number_machine,
          name_machine: formValue.name_machine,
          description: formValue.description,
          idcustomer: formValue.idcustomer,
          idcategory: formValue.idcategory,
          weight: formValue.weight,
          shipment: formValue.shipment,
          oldNameOrder: oldNameOrder
        },
        insertProps: props
      }
      const data = await this.appService.query(method, url,dataServer);
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


  async castCat() {
    try {
      const data: Icategorycastomer = await this.appService.query('get', 'http://localhost:3000/newOrder/selectcustcat');
      this.customers = data.customers;
      this.categories = data.categories;
    } catch (error) {
      alert(error)
    }
  }


  ngOnInit() {
    this.castCat();
    for (let index = 0; index < 14; index++) {
      this.dataProperties.push({ property: "", val: "", idproperty: 0 })
    }
    let event = new Event("click");
    document.getElementById('id_machine')!.dispatchEvent(event);
  }

}











