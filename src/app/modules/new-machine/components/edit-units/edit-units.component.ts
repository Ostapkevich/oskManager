import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Iunits, IOrder } from './IUnits';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-new-unit',
  templateUrl: './edit-units.component.html',
  styleUrls: ['./edit-units.component.css']

})
export class EditUnitsComponent implements OnInit {
  constructor(private appService: AppService) {

  }
  changedData = false;
  navigator: TableNavigator | undefined;
  userName: string = "Иванов П.К.";
  order: IOrder | undefined;
  units: Partial<Iunits>[] = [];


  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;
  @ViewChild('newTemplate', { static: false })
  newTemplate!: TemplateRef<any>;

  loadTemplate(unit: Partial<Iunits>) {
    if (unit.id_specification && unit.newOrEdit === undefined) {
      return this.readOnlyTemplate
    } else if (unit.id_specification && unit.newOrEdit === true) {
      return this.editTemplate;
    } else {
      return this.newTemplate;
    }
  }



  escapeAll() {
    if (this.changedData === false) {
      return;
    } else {
      if (confirm("Отменить все несохраненные изменения?") === false) {
        return;
      }
    }
    this.loadUnits(this.order?.order_machine!);
    this.changedData = false;
  }


  moveUnit(isMoveUp: boolean) {
    let i = this.navigator?.findCheckedRowNumber();
    if (i !== null) {
      const unit = this.units[i!];
      if (isMoveUp && i! > 0) {
        this.units[i!] = this.units[i! - 1];
        this.units[i! - 1] = unit;
      } else if (!isMoveUp && i! < this.units.length - 1) {
        this.units[i!] = this.units[i! + 1];
        this.units[i! + 1] = unit;
      }
      this.changedData = true;
    }
  }

  escape(event: Event) {
    const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
    this.units.splice(index, 1);
  }

  editeRow(event: Event) {
    const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
    this.units[index].newOrEdit = true;
    this.changedData = true;
  }

  addUnit() {
    if (!this.order) {
      return;
    }
    const editedUnit: Partial<Iunits> = {};
    let index = this.navigator!.findCheckedRowNumber();
    editedUnit.id_specification = null;
    editedUnit.unit = '';
    editedUnit.number_unit = '';
    editedUnit.name_unit = '';
    editedUnit.weight = 0;
    editedUnit.newOrEdit = true;
    if (index === null) {
      this.units.push(editedUnit);
    } else {
      this.units.splice(index + 1, 0, editedUnit);
    }
    this.changedData = true;
  }

  async inpOrderEnter($event: KeyboardEvent, id: string) {
    try {
      if ($event.key === 'Enter' && id !== "") {
        if (this.changedData === true) {
          if (confirm("Данные не сохранены! Продолжить без сохранения?") === false) {
            return;
          }
        }
        const data = await this.appService.query('get', `http://localhost:3000/editUnits/getOrderAndUnits-${id}`)
        if ((data as []).length === 0) {
          this.units.length = 0;
          this.order = undefined;
          this.changedData = false;
          alert("Данный заказ закрыт или не существует!");
          return;
        }
        this.order = data[0].order[0];
        this.units = data[0].units;
        this.changedData = false;

      }
    } catch (error) {
      alert(error);
    }
  }

  async loadUnits(id: string) {
    try {
      const data = await this.appService.query('get', `http://localhost:3000/editUnits/getUnits-${id}`)
      this.units = data;
    } catch (error) {
      alert(error);
    }

  }

  async btnDelClick() {
    try {
      const i = this.navigator?.findCheckedRowNumber();
      if (i == null) {
        return;
      }
      const idSp = this.units[i].id_specification;
      if (!idSp) {
        alert('Для удаления добавленного узла используйте кнопку "Омена".')
        return;
      }
      else {
        let data = await this.appService.query('get', `http://localhost:3000/editUnits/isEmptyUnit-${idSp}`);
        if ((data as []).length > 0) {
          let answer = prompt(`Вы действительно хотите удалить узел и входящие в него данные? 
        Для подтверждения введите номер узла ${this.units[i].unit}.`);
          if (answer !== this.units[i].unit) {
            return;
          }
        } else if ((data as []).length === 0) {
          if (confirm("Вы действительно хотите удалить узел?") === false) {
            return;
          }
        } else {
          alert('Что-то пошло не так...');
          return;
        }
        data = await this.appService.query('delete', `http://localhost:3000/editUnits/deleteUnit`,[idSp,this.order?.order_machine]);
        this.units = data;
        alert("Узел удален!");
      }
    } catch (error: any) {
      alert(error);
    }
  }

  async saveUnits() {
    try {
      if (this.changedData === false) {
        return;
      }
      let sentUnits: Partial<Iunits>[] = [];
      let i = 0;
      for (const item of this.units) {
        sentUnits.push(item);
        sentUnits[i].ind = i;
        sentUnits[i].order_machine = this.order?.order_machine;
        delete sentUnits[i].idauthor;
        delete sentUnits[i].nameUser;
        delete sentUnits[i].status_unit;
        delete sentUnits[i].started;
        delete sentUnits[i].finished;
        delete sentUnits[i].newOrEdit;
        if (item.id_specification === undefined) {
          this.units[i].status_unit = 1;
          sentUnits[i].id_specification = null;
        }
        i++;
      }
      const data = await this.appService.query('put', `http://localhost:3000/editUnits/saveUnits-${this.order?.order_machine!}`, sentUnits);
      this.units = data;
      alert('Данные сохранены!');
      this.changedData = false;
    } catch (error) {
      alert(error);
    }
  }



  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('idinpOrder')!.dispatchEvent(event);
    this.navigator = new TableNavigator(document.getElementById('tblUnits') as HTMLTableElement);
  }
}
