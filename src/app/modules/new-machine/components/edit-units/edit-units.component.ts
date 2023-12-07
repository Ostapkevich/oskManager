import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TemplateRef, ViewChild } from '@angular/core';
import { EditUnitsService } from './edit-units.service';
import { Iunits, IOrder } from './IUnits';
import { TableNavigator } from 'src/app/classes/tableNavigator';

@Component({
  selector: 'app-new-unit',
  templateUrl: './edit-units.component.html',
  styleUrls: ['./edit-units.component.css']
})
export class EditUnitsComponent implements OnInit {
  constructor(private editUnitsService: EditUnitsService) {

  }
  changedData = false;
  navigator: TableNavigator | undefined;
  userName: string = "Иванов П.К.";
  order: IOrder | undefined;
  units: Partial<Iunits>[] = [];
  сhangedData = false;

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


  saveUnits() {
    if (this.changedData = false) {
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
      if (item.id_specification === undefined) {
        this.units[i].status_unit = 1;
        sentUnits[i].id_specification = null;
      }
      i++;
    }
    this.editUnitsService.saveUnits(sentUnits).subscribe({
      next: (data: any) => {
        if (data.serverError) {
          alert(data.serverError);
          return;
        }
        if (data.response === 'ok') {
          this.loadUnits(this.order?.order_machine!);
          this.changedData = false;
          alert('Данные сохранены!');
        }
      },
      error: error => alert('Что-то пошло не так : ' + error.message)
    });
  }


  findCheckedRowNumber(): number | null {
    const tUnits: any = document.getElementById('tblUnits');
    const rowsCollection = tUnits.rows;
    if (rowsCollection) {
      for (let i = 0; i < rowsCollection.length; i++) {
        if ((rowsCollection[i].cells[0].firstChild.firstChild as HTMLInputElement).checked) {
          return i;
        }
      }
    }
    return null;
  }

  findRowButton(target: HTMLButtonElement): number {
    const tUnits: any = document.getElementById('tblUnits');
    const rowsCollection = tUnits.rows;
    let i = 0
    for (i = 0; i < rowsCollection.length; i++) {
      if (rowsCollection[i].cells[8].firstChild == target) {
        break;
      }
    }
    return i;
  }

  escape(event: Event) {
    const index = this.findRowButton(event.target as HTMLButtonElement);
    this.units.splice(index, 1);
  }

  editeRow(event: Event) {
    const index = this.findRowButton(event.target as HTMLButtonElement);
    this.units[index].newOrEdit = true;
    this.changedData = true;
  }


  addUnit() {
    if (!this.order) {
      return;
    }
    const editedUnit: Partial<Iunits> = {};
    let index = this.findCheckedRowNumber();

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

  loadOrder(id: string) {
    this.editUnitsService.loadOrder(id).subscribe({
      next: (data: any) => {
        if (data == null) {
          alert("Данный заказ закрыт или не существует!");
          return;
        }
        if (data.serverError) {
          alert(data.serverError);
          return;
        }
        this.order = data;
      }
      ,
      error: error => alert('Что то пошло не так : ' + error.message)
    });
  }


  loadUnits(id: string) {
    this.editUnitsService.loadUnits(id).subscribe({
      next: (data: any) => {
        if (data.serverError) {
          alert(data.serverError);
          return;
        }
        if (data !== undefined) {
          this.units = data;

        }
      }
      ,
      error: error => alert('Что то пошло не так : ' + error.message)
    });
  }


  inpOrderEnter($event: KeyboardEvent, id: string) {
    if ($event.key === 'Enter' && id !== "") {
      if (this.changedData === true) {
        if (confirm("Данные не сохранены! Продолжить без сохранения?") === false) {
          return;
        }
      }
      this.loadOrder(id);
      this.loadUnits(id);
      this.changedData = false;
    }
  }


  boxChange(event: any) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox !== event.target) {
        (checkbox as HTMLInputElement).checked = false;
      }
    });
  }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('idinpOrder')!.dispatchEvent(event);
    this.navigator = new TableNavigator(document.getElementById('tblUnits') as HTMLTableElement);
  }
}
