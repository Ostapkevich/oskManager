import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges } from '@angular/core';
import { Isteel, IrolledType, Irolled, IRolledMaterial } from './iRolled';
import { AppService } from 'src/app/app.service';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AddRolledComponent } from '../add-rolled/add-rolled.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  imports: [AddRolledComponent, FormsModule, CommonModule],
  standalone: true,
  selector: 'app-rolled',
  templateUrl: './rolled.component.html',
  styleUrls: ['./rolled.component.css']
})
export class RolledComponent implements OnInit {

  constructor(private appService: AppService) {


  }


  @Input() showAddRolled: Boolean = true;
  rolledType: IrolledType[] | undefined;
  steels: Isteel[] | undefined;
  materials: Irolled[] = [];
  index: number = 1;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;



  page: number = 1;
  tblNavigator: TableNavigator | undefined;

  loadTemplate(rolled: Irolled) {
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
    this.materials.length = 0;
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
    for (const item of this.materials) {
      if (item.isEdited === true) {
        alert('Редактирование допускается по одной строке!');
        return;
      }
    }
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 7);
    this.materials[index].isEdited = true;
    this.materials[index].initial_name_item = this.materials[index].name_item;
    this.materials[index].initial_d= this.materials[index].d;
    this.materials[index].initial_t= this.materials[index].t;
    this.materials[index].initial_weight= this.materials[index].weight;
   
  }

  escape(target: any) {
    const index = this.tblNavigator!.findRowInsertedButton(target as HTMLButtonElement, 7,1);
      this.materials[index].isEdited = false;
      this.materials[index].name_item=this.materials[index].initial_name_item;
      this.materials[index].d=this.materials[index].initial_d;
      this.materials[index].t=this.materials[index].initial_t;
      this.materials[index].weight=this.materials[index].initial_weight;
  
     } 

  async loadRolleds(rolledtype: number, steel: number, position: number, str?: string) {
    try {
      let data: IRolledMaterial;
      if (str && str.length > 0) {
        const resultArray: string[] = [str];

        data = await this.appService.query('get', `http://localhost:3000/rolled/getRolled/${rolledtype}/${steel}/${position}`, resultArray);
      } else {
        data = await this.appService.query('get', `http://localhost:3000/rolled/getRolled/${rolledtype}/${steel}/${position}`);
      }
      this.materials!.length = 0;
      if ((data.rolleds as []).length !== 0) {
        this.materials = data.rolleds;
        for (const item of this.materials) {
          item.isEdited = false;
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async updateRolled(event: Event) {
    try {
      const weightPttern: RegExp = /^\d{1,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 7);
      const name_rolled = this.materials[index].name_item;
      const d = this.materials[index].d;
      const weight = this.materials[index].weight;
      const t = this.materials[index].t;
      const id_rolled = this.materials[index].id_item;

      if (name_rolled === '') {
        alert('Не введено название проката!');
        return;
      }
      if (String(weight) === '' || weightPttern.test(String(weight)) === false) {
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
      const data = await this.appService.query('put', 'http://localhost:3000/rolled/updateRolled', dataServer);
      if (data.response === 'ok') {
        this.materials[index].isEdited = false;
        alert('Данные сохранены!');
        this.findRolleds();
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }


  async onLoad() {
    try {
      const data: IRolledMaterial = await this.appService.query('get', 'http://localhost:3000/rolled/onLoad');
      if ((data.rolled_type as []).length !== 0) {
        this.rolledType = data.rolled_type;
      }
      if ((data.steels as []).length !== 0) {
        this.steels = data.steels;
      }
      if ((data.rolleds as []).length !== 0) {
        this.materials = data.rolleds;
        for (const item of this.materials) {
          item.isEdited = false;
        }

      }
    } catch (error) {
      alert(error);
    }
  }

  async saveNewRolled() {
    try {
    console.log('a')
      const idrolled_type = +(document.getElementById('selectRolled') as HTMLSelectElement).value;
      const idsteel = +(document.getElementById('selectSteel') as HTMLSelectElement).value;
      const name_rolled = (document.getElementById('newMaterial') as HTMLInputElement).value;
      const d = (document.getElementById('diameter') as HTMLInputElement).value;
      const weight = (document.getElementById('weight') as HTMLInputElement).value;
      const t = (document.getElementById('width') as HTMLInputElement).value;
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      if (idrolled_type === -1 || idsteel === -1) {
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
      const data = await this.appService.query('post', 'http://localhost:3000/rolled/addRolled', dataServer);
      if (data.response === 'ok') {
        alert('Позиция добавлена!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
      this.findRolleds();
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
      await this.appService.query('delete', `http://localhost:3000/rolled/deleteRolled`, [this.materials[i].id_item]);
      this.materials.splice(i,1);
    } catch (error: any) {
      alert(error);
    }
  }

  ngOnInit(): void {
    this.onLoad();
    let event = new Event("click");
    document.getElementById('searchMaterial')!.dispatchEvent(event);
    this.tblNavigator = new TableNavigator(document.getElementById('tblRolled') as HTMLTableElement, 0);

  }


}
