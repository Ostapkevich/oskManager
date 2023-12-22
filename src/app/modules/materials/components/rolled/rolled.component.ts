import { Navigation } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Isteel, IrolledType, Irolled, Imaterial } from './iMaterials';
import { AppService } from 'src/app/app.service';
import { TableNavigator } from 'src/app/classes/tableNavigator';

@Component({
  selector: 'app-rolled',
  templateUrl: './rolled.component.html',
  styleUrls: ['./rolled.component.css']
})
export class RolledComponent implements OnInit {

  constructor(private appService: AppService) {

  }

  units: string = ''
  rolledType: IrolledType[] | undefined;
  steels: Isteel[] | undefined
  rolleds: Irolled[] = [];
  index: number = 0;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;
 


  position: number = 0;
  navigator: TableNavigator | undefined;

  loadTemplate(rolled: Irolled) {
    if (rolled.isEdited === false) {
      return this.readOnlyTemplate;
    } else {
      return this.editTemplate;
    }
  }


  async updateRolled(event: Event) {
    const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
    const numberPattern: RegExp = /^\d+$/;
    const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
    const name_rolled = this.rolleds[index].name_rolled;
    const d = this.rolleds[index].d;
    const weight = this.rolleds[index].weight;
    const t = this.rolleds[index].t;
    const id_rolled = this.rolleds[index].id_rolled

    if (name_rolled === '') {
      alert('Не введено название проката!');
      return;
    } else if (String(weight) === '' || weightPttern.test(String(weight)) === false) {
      alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
      return;
    } else if (String(d) === '' && String(t) === '') {
      alert('Введите размеры проката!');
      return;
    } else if (String(d) !== '' && numberPattern.test(String(d)) === false) {
      alert('Введите корректно диаметр! Допускаются только цифры!');
      return;
    } else if (String(t) !== '' && numberPattern.test(String(t)) === false) {
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
     const data = await this.appService.query('post', 'http://localhost:3000/materials/updateRolled', dataServer);
    if (data.response === 'ok') {
      alert('Данные сохранены!');
      this.rolleds[index].isEdited = false;
    } else {
      alert("Что-то пошло не так... Данные не сохранены!");
    }
  }


  tableEditRow(event: Event) {
    const index = this.navigator!.findRowButton(event.target as HTMLButtonElement);
    console.log(index)
    this.rolleds[index].isEdited = true;
  }


  inputClickTofindRolleds() {
    const str = (document.getElementById('searchMaterial') as HTMLInputElement).value;
    const rolledtype = (document.getElementById('selectRolled') as HTMLSelectElement).value;
    const steel = (document.getElementById('selectSteel') as HTMLSelectElement).value;
    if (str.length > 0) {
      this.loadRolleds(+rolledtype, +steel, this.position, str);
    } else {
      this.loadRolleds(+rolledtype, +steel, this.position);
    }
  }


  async loadRolleds(rolledtype: number, steel: number, position: number, str?: string) {
    try {
      let data: Imaterial;
      if (str) {
        const resultArray = str.split(' ');
        data = await this.appService.query('get', `http://localhost:3000/materials/rolleds/${rolledtype}/${steel}/${position}`, resultArray);
      } else {
        data = await this.appService.query('get', `http://localhost:3000/materials/rolleds/${rolledtype}/${steel}/${position}`);
      }
      this.rolleds!.length = 0;
      if ((data.rolleds as []).length !== 0) {
        this.rolleds = data.rolleds;
        for (const item of this.rolleds) {
          item.isEdited = false;
        }
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
      const data = await this.appService.query('post', 'http://localhost:3000/materials/addRolled', dataServer);
      if (data.response === 'ok') {
        alert('Позиция добавлена!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
      this.rolleds.length = 0;
      this.inputClickTofindRolleds();
    } catch (error) {
      alert(error);
    }

  }

  async onLoad() {
    try {
      const data: Imaterial = await this.appService.query('get', 'http://localhost:3000/materials/onLoad');
      if ((data.rolled_type as []).length !== 0) {
        this.rolledType = data.rolled_type;
      }
      if ((data.steels as []).length !== 0) {
        this.steels = data.steels;
      }
      if ((data.rolleds as []).length !== 0) {
        this.rolleds = data.rolleds;
        for (const item of this.rolleds) {
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
    this.navigator = new TableNavigator(document.getElementById('tblRolled') as HTMLTableElement,0,7);
  }


}
