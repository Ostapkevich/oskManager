import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Icategorycastomer, Iorder, IProperties } from './iNewOrderInterfase';
import { OrderService } from './order.service';


@Component({
  selector: 'app-new-machine',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [],

})
export class NewOrderComponent implements OnInit {


  constructor(private orderServise: OrderService, private router: Router, private activateRoute: ActivatedRoute) {
    this.newOrder = activateRoute.snapshot.params['newOrder'];
    this.subscription = activateRoute.params.subscribe(
      (params) => (this.newOrder = params['newOrder']))

  }
  private subscription: Subscription;
  newOrder: string; // 'edit' или 'new' передается в параметре запроса
  customerOnload: number | undefined;
  categoryOnload: number | undefined;
  dataChanged: boolean | null | undefined = false;
  category_customer: Icategorycastomer | undefined;
  dataProperties: Array<IProperties> = [];
  dataOrder: Iorder | undefined;


  @ViewChild("templateCustomer", { static: false })
  customerRef: ElementRef | undefined;

  @ViewChild("templateCategory", { static: false })
  categoryRef: ElementRef | undefined;

  @ViewChild("newOrderform", { static: false })
  newOrderform: NgForm | undefined;

  formChange(dataForm: NgForm) {
    this.dataChanged = dataForm.dirty;
  }


  loadNewOrder(id: string) {
    this.orderServise.loadNewOrder(id).subscribe({
      next: (data: any) => {
        if (data == null) {
          alert("Данный заказ закрыт или не существует!");
          return;
        }
        if (data.serverError) {
          alert(data.serverError);
          return;
        }
             
        if (data.description=null) {
        data.description="";
       }
       if (data.description=null) {
        data.description="";
       }
        this.dataOrder = data;
        this.categoryOnload = this.dataOrder?.idcategory;
        this.customerOnload = this.dataOrder?.idcustomer;
        let inputDate: any;
        inputDate = document.getElementById("plane");
        inputDate.value = this.dataOrder?.shipment;
        let select: HTMLSelectElement = this.customerRef?.nativeElement;
        let options: any = select.children;
        let len = options.length;
        for (var i = 0; i < len; i++) {
          if (+options[i].value === this.dataOrder?.idcustomer) {
            select.options[i].selected = true;
            break;
          }
        }
        select = this.categoryRef?.nativeElement;
        options = select.children;
        len = options.length;
        for (var i = 0; i < len; i++) {
          if (+options[i].value === this.dataOrder?.idcategory) {
            select.options[i].selected = true;
            break;
          }
        }
        descrip();
      }
      ,
      error: error => alert('Что то пошло не так : ' + error.message)
    });
    let descrip = () => {
      this.orderServise.getOrderDescription(id!).subscribe({
        next: (data: any) => {
          if (data.serverError) {
            alert(data.serverError);
            return;
          }
          let i = 0;
          for (const iterator of data) {
            this.dataProperties[i] = iterator;
            i++;
          }
          for (i = i; i < 14; i++) {
            this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
          }
        },
        error: error => alert('Что-то пошло не так : ' + error.message)
      });
    }
  }


  getNewOrder($event: KeyboardEvent, id: string) {
    if ($event.key !== 'Enter') {
      return;
    } else if (id === "") {
      return;
    }
    this.loadNewOrder(id);
  }


  getAnalogOrder() {
    const analogOrder = prompt("Введите номер заказа аналога");
    if (analogOrder === "" || analogOrder === null) {
      return
    }
    this.orderServise.loadAnalogOrder(analogOrder!).subscribe({
      next: (data: any) => {
        if (data == null) {
          alert("Данный заказ не существует!");
          return;
        }
        if (data.serverError) {
          alert(data.serverError);
          return;
        }
        const str = this.dataOrder?.order_machine
        if (data.description=null) {
          data.description="";
         }
        this.dataOrder = data;
        data.order_machine = str;
        this.categoryOnload = this.dataOrder?.idcategory;
        const select = this.categoryRef?.nativeElement;
        const options = select.children;
        const len = options.length;
        for (var i = 0; i < len; i++) {
          if (+options[i].value === this.dataOrder?.idcategory) {
            select.options[i].selected = true;
            break;
          }
        }
        descrip();
      }
      ,
      error: error => alert('Что-то пошло не так : ' + error.message)
    });
    const descrip = () => {
      this.orderServise.getOrderDescription(analogOrder!).subscribe({
        next: (data: any) => {
          if (data.serverError) {
            alert(data.serverError);
            return;
          }
          let i = 0;
          for (const iterator of data) {
            this.dataProperties[i] = iterator;
            i++;
          }
          for (i = i; i < 14; i++) {
            this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
          }
        },
        error: error => alert('Что-то пошло не так : ' + error.message)
      });
    }
  }


  saveOrder(dataForm: any, shipment: any) {
    const updateInsertProps: Array<IProperties> = [];
    const deleteProps: Array<IProperties> = [];
    if (shipment !== "" && Date.parse(shipment) < Date.now()) {
      alert('Дата отгрузки меньше текущей даты');
      return;
    } else if (shipment === "") {
      dataForm.shipment = null;
    }
    if (this.newOrder === "new") {
      if (!dataForm.idcategory || !dataForm.idcustomer) {
        alert("Выберите заказчика и категорию!");
        return;
      }
      this.orderServise.createOrder(dataForm)!.subscribe({
        next: (data:any) => {
          if (data.serverError) {
            alert(data.serverError);
            return;
          }
          if (data.response === 'ok') {
            if (confirm("Даные сохранены! Продолжить редкатирование?") === true) {
              this.dataChanged = false;
              this.newOrder = 'edit';
              this.loadNewOrder(dataForm.order_machine);
            } else {
              this.dataChanged = false;
              this.router.navigate([""]);
            }
          } else {
            alert("Данные не сохранены!");
          }
        },
        error: error => alert('Что-то пошло не так : ' + error.message)
      });

    } else {
      if (this.dataOrder?.order_machine !== dataForm.order_machine) {
        if (!confirm("Хотите изменить номер заказа?")) {
          return;
        }
      }
      let i = 0;
      for (const property of this.dataProperties) {//добавленные свойства
        if (property.property === "" && dataForm[`char${i}`] !== "") {
          updateInsertProps.push({ idproperty: null, order_machine: dataForm["order_machine"], property: dataForm[`char${i}`], val: dataForm[`val${i}`] });
          i++;;
          continue;
        }
        if ((property.property !== dataForm[`char${i}`] || property.val !== dataForm[`val${i}`])) {//измененные свойства
          if (dataForm[`char${i}`] !== "") {
            updateInsertProps.push({ idproperty: property.idproperty, order_machine: '', property: dataForm[`char${i}`], val: dataForm[`val${i}`], });
            i++;
            continue;
          } else {
            deleteProps.push({ idproperty: property.idproperty });//удаленные свойства
          }
        }
        i++
        continue;
      }
      this.orderServise.saveEditedOrder({
        mainData:
        {
          order_machine: dataForm.order_machine,
          number_machine: dataForm.number_machine,
          name_machine: dataForm.name_machine,
          description: dataForm.description,
          idcustomer: dataForm.idcustomer,
          idcategory: dataForm.idcategory,
          shipment: dataForm.shipment,
          oldNameOrder: this.dataOrder?.order_machine
        },
        updateInsertProps: updateInsertProps, deleteProps: deleteProps
      })!.subscribe({
        next: (data:any) => {
          if (data.serverError) {
            alert (data.serverError);
            return;
          }
          if (data.response === 'updated') {
            if (confirm("Даные сохранены! Продолжить редкатирование?") === true) {
              this.dataChanged = false;
              this.loadNewOrder(dataForm.order_machine);
            } else {
              this.dataChanged = false;
              this.router.navigate([""]);
            }
          } else if (data.response === 'notUpdated') {
            alert(`Заказ с номером ${dataForm.order_machine} уже существует`);
          } 
        },
        error: error => alert('Что-то пошло не так : ' + error.message)
      });
    }
  }


  ngOnInit(): void {
    this.orderServise.loadCustCat().subscribe({
      next: (data: any) => {
        if (data.serverError) {
          alert(data.serverError);
          return;
        } else {
          this.category_customer = data;
        }

      },
      error: error => alert('Что то пошло не так : ' + error.message)
    });
    for (let index = 0; index < 14; index++) {
      this.dataProperties.push({ property: "", val: "", idproperty: 0 })
    }
    let event = new Event("click");
    document.getElementById('id_machine')!.dispatchEvent(event);
  }



}










