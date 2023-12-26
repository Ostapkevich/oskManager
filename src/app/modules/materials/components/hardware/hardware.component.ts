import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { IhardwareType, Ihardware, IHardwareMaterial } from './iHardware';
import { Isteel } from '../../iSteel';

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.css']
})
export class HardwareComponent {

  constructor(private appService: AppService) { }

  units: string = ''
  hardwareType: IhardwareType[] | undefined;
  steels: Isteel[] | undefined
  hardwares: Ihardware[] = [];
  index: number = 1;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;



  page: number = 1;
  navigator: TableNavigator | undefined;

  loadTemplate(rolled: Ihardware) {
    if (rolled.isEdited === false) {
      return this.readOnlyTemplate;
    } else {
      return this.editTemplate;
    }
  }

  nextPage() {
    if (this.hardwares.length < 20) {
      return;
    }
    this.page++;
    this.findRolleds();
  }

  previousPage() {
    if (this.page === 1) {
      return
    } else {
      this.page--;
      this.findRolleds()
    }
  }

  firstPage() {
    this.page = 1;
    this.findRolleds();
  }

  findRolleds() {
    const str = (document.getElementById('searchMaterial') as HTMLInputElement).value;
    const rolledtype = (document.getElementById('selectRolled') as HTMLSelectElement).value;
    const steel = (document.getElementById('selectSteel') as HTMLSelectElement).value;
    if (str.length > 0) {
      if (this.page === 1) {
        this.loadRolleds(+rolledtype, +steel, this.page - 1, str);
      } else {
        this.loadRolleds(+rolledtype, +steel, (this.page - 1) * 20 - 1, str);
      }
    } else {
      if (this.page === 1) {
        this.loadRolleds(+rolledtype, +steel, this.page - 1);
      } else {
        this.loadRolleds(+rolledtype, +steel, (this.page - 1) * 20 - 1);
      }
    }
  }

  tableEditRow(event: Event) {
    for (const item of this.hardwares) {
      if (item.isEdited === true) {
        alert('Редактирование допускается по одной строке!');
        return;
      }
    }
    const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
    console.log(index)
    this.hardwares[index].isEdited = true;
  }

  async loadRolleds(rolledtype: number, steel: number, position: number, str?: string) {
    try {
      let data: IHardwareMaterial;
      if (str && str.length > 0) {
        const resultArray: string[] = [str];

        data = await this.appService.query('get', `http://localhost:3000/hardware/getHardware/${rolledtype}/${steel}/${position}`, resultArray);
      } else {
        data = await this.appService.query('get', `http://localhost:3000/hardware/getHardware/${rolledtype}/${steel}/${position}`);
      }
      this.hardwares!.length = 0;
      if ((data.hardwares as []).length !== 0) {
        this.hardwares = data.hardwares;
        for (const item of this.hardwares) {
          item.isEdited = false;
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async updateRolled(event: Event) {
    try {
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
      const name_rolled = this.hardwares[index].name_hardware;
      const d = this.hardwares[index].d;
      const weight = this.hardwares[index].weight;
      const t = this.hardwares[index].L;
      const id_rolled = this.hardwares[index].idhardware

      if (name_rolled === '') {
        alert('Не введено название проката!');
        return;
      }
      if (String(weight) === '' || weightPttern.test(weight) === false) {
        alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
        return;
      }
      if ((d === null || String(d) === '') && (t === null || String(t) === '')) {
        alert('Введите размеры проката!');
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
        this.hardwares[index].isEdited = false;
       alert('Данные сохранены!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

  async saveNewRolled() {
    try {
      const idrolled_type = +(document.getElementById('selectRolled') as HTMLSelectElement).value;
      const idsteel = +(document.getElementById('selectSteel') as HTMLSelectElement).value;
      const name_rolled = (document.getElementById('newMaterial') as HTMLInputElement).value;
      const d = (document.getElementById('diameter') as HTMLInputElement).value;
      const weight = (document.getElementById('weight') as HTMLInputElement).value;
      const t = (document.getElementById('width') as HTMLInputElement).value;
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      if (idrolled_type === 1 || idsteel === 1) {
        alert('Выберите тип проката и материал!');
        return;
      } else if (name_rolled === '') {
        alert('Не введено название проката!');
        return;
      } else if (weight === '' || weightPttern.test(weight) === false) {
        alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
        return;
      } else if (d === '' && t === '') {
        alert('Введите размеры проката!');
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
      this.hardwares.length = 0;
      this.findRolleds();
    } catch (error) {
      alert(error);
    }

  }

  async btnDel() {
    try {
      const i = this.navigator?.findCheckedRowNumber();
      if (i == null) {
        return;
      }
      const id = this.hardwares[i].idhardware;
      let data = await this.appService.query('get', `http://localhost:3000/hardware/isUsedHardware/${id}`);
      if ((data as []).length > 0) {
        let answer = confirm(`Этот прокат используется в базе чертежей. Его удаление приведет к остутсвию этого материала в использующих его чертежах и заказах. Вы ействительно хотите удалить даную позицию?`);
        if (answer !== true) {
          return;
        }
      } else if ((data as []).length === 0) {
        if (confirm("Вы действительно хотите удалить данную позицию?") === false) {
          return;
        }
      } else {
        alert('Что-то пошло не так...');
        return;
      }
      data = await this.appService.query('delete', `http://localhost:3000/hardware/deleteHardware`, [id]);
      if (data.response === 'ok') {
        this.findRolleds();
      }

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
        this.hardwares = data.hardwares;
        for (const item of this.hardwares) {
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
    this.navigator = new TableNavigator(document.getElementById('tblRolled') as HTMLTableElement, 0, 7);
  }
}
