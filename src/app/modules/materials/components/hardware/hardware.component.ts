import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { IhardwareType, Ihardware, IHardwareMaterial } from './iHardware';
import { Isteel } from '../../iSteel';
import { AddHardwareComponent } from '../add-hardware/add-hardware.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [AddHardwareComponent, FormsModule, CommonModule],
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.css']
})
export class HardwareComponent implements OnInit {

  constructor(private appService: AppService) { }

  @Input() showAddHardware: Boolean = true;
  hardwareType: IhardwareType[] | undefined;
  steels: Isteel[] | undefined
  materials: Ihardware[] = [];
  index: number = 1;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;



  page: number = 1;
  tblNavigator: TableNavigator | undefined;

  loadTemplate(rolled: Ihardware) {
    if (rolled.isEdited === false) {
      return this.readOnlyTemplate;
    } else {
      return this.editTemplate;
    }
  }

  nextPage() {
    if (this.materials.length < 20) {
      return;
    }
    this.page++;
    this.findHardwares();
  }

  previousPage() {
    if (this.page === 1) {
      return
    } else {
      this.page--;
      this.findHardwares()
    }
  }

  firstPage() {
    this.page = 1;
    this.findHardwares();
  }

  findHardwares() {
    this.materials.length = 0;
    const str = (document.getElementById('searchMaterial') as HTMLInputElement).value;
    const rolledtype = (document.getElementById('selectHardware') as HTMLSelectElement).value;
    const steel = (document.getElementById('selectSteel') as HTMLSelectElement).value;
    if (str.length > 0) {
      if (this.page === 1) {
        this.loadHardwares(+rolledtype, +steel, this.page - 1, str);
      } else {
        this.loadHardwares(+rolledtype, +steel, (this.page - 1) * 20 - 1, str);
      }
    } else {
      if (this.page === 1) {
        this.loadHardwares(+rolledtype, +steel, this.page - 1);
      } else {
        this.loadHardwares(+rolledtype, +steel, (this.page - 1) * 20 - 1);
      }
    }
  }

  tableEditRow(event: Event) {
    for (const item of this.materials) {
      if (item.isEdited === true) {
        alert('Редактирование допускается по одной строке!');
        return;
      }
    }
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 7);
    this.materials[index].isEdited = true;
    this.materials[index].initial_L = this.materials[index].L;
    this.materials[index].initial_d = this.materials[index].d;
    this.materials[index].initial_name_item = this.materials[index].name_item;
    this.materials[index].initial_weight = this.materials[index].weight;
  }

  escape(target: any) {
    const index = this.tblNavigator!.findRowInsertedButton(target as HTMLButtonElement, 7, 1);
    this.materials[index].isEdited = false;
    this.materials[index].L = this.materials[index].initial_L;
    this.materials[index].d = this.materials[index].initial_d;
    this.materials[index].name_item = this.materials[index].initial_name_item;
    this.materials[index].weight = this.materials[index].initial_weight;
  }

  async loadHardwares(rolledtype: number, steel: number, position: number, str?: string) {
    try {
      let data: IHardwareMaterial;
      if (str && str.length > 0) {
        const resultArray: string[] = [str];

        data = await this.appService.query('get', `http://localhost:3000/hardware/getHardware/${rolledtype}/${steel}/${position}`, resultArray);
      } else {
        data = await this.appService.query('get', `http://localhost:3000/hardware/getHardware/${rolledtype}/${steel}/${position}`);
      }
      this.materials!.length = 0;
      if ((data.hardwares as []).length !== 0) {
        this.materials = data.hardwares;
        for (const item of this.materials) {
          item.isEdited = false;
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async updateHardwares(event: Event) {
    try {
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 7);
      const name_rolled = this.materials[index].name_item;
      const d = this.materials[index].d;
      const weight = this.materials[index].weight;
      const t = this.materials[index].L;
      const id_rolled = this.materials[index].id_item

      if (name_rolled === '') {
        alert('Не введено название!');
        return;
      }
      if (String(weight) === '' || weightPttern.test(String(weight)) === false) {
        alert('Заполните поле с массой! Допускается 4 цифры до точки и три цифры после точки!');
        return;
      }
      if ((d === null || String(d) === '') && (t === null || String(t) === '')) {
        alert('Введите размеры!');
        return;
      }
      if (d !== null && String(d) !== '' && numberPattern.test(String(d)) === false) {
        alert('Введите корректно диаметр! Допускаются только цифры!');
        return;

      }

      if (t !== null && String(t) !== '' && numberPattern.test(String(t)) === false) {
        alert('Введите корректно толщину! Допускаются только цифры!');
        return;
      }
      const dataServer = {
        name_rolled: name_rolled,
        d: d || null,
        weight: weight,
        t: t || null,
        id_rolled: id_rolled
      }
      const data = await this.appService.query('put', 'http://localhost:3000/hardware/updateHardware', dataServer);
      if (data.response === 'ok') {
        this.materials[index].isEdited = false;
        alert('Данные сохранены!');
        this.findHardwares();
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

  async saveNewHardware() {
    try {
      const idrolled_type = +(document.getElementById('selectHardware') as HTMLSelectElement).value;
      const idsteel = +(document.getElementById('selectSteel') as HTMLSelectElement).value;
      const name_rolled = (document.getElementById('newMaterial') as HTMLInputElement).value;
      const d = (document.getElementById('diameter') as HTMLInputElement).value;
      const weight = (document.getElementById('weight') as HTMLInputElement).value;
      const t = (document.getElementById('width') as HTMLInputElement).value;
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      if (idrolled_type === -1 || idsteel === -1) {
        alert('Выберите тип и материал!');
        return;
      } else if (name_rolled === '') {
        alert('Не введено название проката!');
        return;
      } else if (weight === '' || weightPttern.test(weight) === false) {
        alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
        return;
      } else if (d === '' && t === '') {
        alert('Введите размеры!');
        return;
      } else if (d !== '' && numberPattern.test(d) === false) {
        alert('Введите корректно диаметр! Допускаются только цифры!');
        return;
      } else if (t !== '' && numberPattern.test(t) === false) {
        alert('Введите корректно толщину! Допускаются только цифры!');
        return;
      }
      const dataServer = {
        idrolled_type: idrolled_type,
        idsteel: idsteel,
        name_rolled: name_rolled,
        d: +d || null,
        weight: +weight,
        t: +t || null
      }
      const data = await this.appService.query('post', 'http://localhost:3000/hardware/addHardware', dataServer);
      if (data.response === 'ok') {
        alert('Позиция добавлена!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
      this.findHardwares();
    } catch (error) {
      alert(error);
    }

  }

  async btnDel() {
    try {
      const i = this.tblNavigator?.findCheckedRowNumber();
      if (i == null) {
        return;
      }
      await this.appService.query('delete', `http://localhost:3000/hardware/deleteHardware`, [this.materials[i].id_item]);
      this.materials.splice(i, 1);
    } catch (error: any) {
      alert(error);
    }
  }

  async onLoad() {
    try {
      const data: IHardwareMaterial = await this.appService.query('get', 'http://localhost:3000/hardware/onLoad');
      if ((data.hardware_type as []).length !== 0) {
        this.hardwareType = data.hardware_type;
      }
      if ((data.steels as []).length !== 0) {
        this.steels = data.steels;
      }
      if ((data.hardwares as []).length !== 0) {
        this.materials = data.hardwares;
        for (const item of this.materials) {
          item.isEdited = false;
        }

      }
    } catch (error) {
      alert(error);
    }
  }

  ngOnInit(): void {
    this.onLoad();
    let event = new Event("click");
    document.getElementById('searchMaterial')!.dispatchEvent(event);
    this.tblNavigator = new TableNavigator(document.getElementById('tblHardware') as HTMLTableElement, 0);
  }
}
