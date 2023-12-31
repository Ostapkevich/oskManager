import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { Imaterial, ImaterialType, IMaterials } from './iOthers';
import { AddOthersComponent } from '../add-others/add-others.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [AddOthersComponent, FormsModule, CommonModule],
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  constructor(protected appService: AppService) {
    this.namePage='Материалы';
    this.nameController='materials'
   }
  namePage='' ;
  nameController=''
  @Input() showAddmaterial: Boolean = true;
  materialType: ImaterialType[] | undefined;
  materials: Imaterial[] = [];
  index: number = 1;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;
  page: number = 1;
  tblNavigator: TableNavigator | undefined;

  loadTemplate(material: Imaterial) {
    if (material.isEdited === false) {
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
    this.findMaterials();
  }

  previousPage() {
    if (this.page === 1) {
      return
    } else {
      this.page--;
      this.findMaterials()
    }
  }

  firstPage() {
    this.page = 1;
    this.findMaterials();
  }

  findMaterials() {
    this.materials.length = 0;
    const str = (document.getElementById('searchMaterial') as HTMLInputElement).value;
    const rolledtype = (document.getElementById('selectMaterials') as HTMLSelectElement).value;
    if (str.length > 0) {
      if (this.page === 1) {
        this.loadMaterials(+rolledtype, this.page - 1, str);
      } else {
        this.loadMaterials(+rolledtype, (this.page - 1) * 20 - 1, str);
      }
    } else {
      if (this.page === 1) {
        this.loadMaterials(+rolledtype, this.page - 1);
      } else {
        this.loadMaterials(+rolledtype, (this.page - 1) * 20 - 1);
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
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement,8);
    this.materials[index].isEdited = true;
    this.materials[index].initial_name_material = this.materials[index].name_material;
    this.materials[index].initial_x1= this.materials[index].x1;
    this.materials[index].initial_x1= this.materials[index].x2;
    this.materials[index].initial_units = this.materials[index].units;
    this.materials[index].initial_specific_units = this.materials[index].specific_units;
    this.materials[index].initial_percent = this.materials[index].percent;
    this.materials[index].units = 0;
    this.materials[index].specific_units = 0;
  }

   escape(event: any) {
     const index = this.tblNavigator!.findRowInsertedButton(event as HTMLButtonElement, 8,1);
     console.log(index)
    this.materials[index].isEdited = false;
    this.materials[index].name_material=this.materials[index].initial_name_material;
    this.materials[index].x1=this.materials[index].initial_x1;
    this.materials[index].x2=this.materials[index].initial_x1 ;
    this.materials[index].units=this.materials[index].initial_units;
    this.materials[index].specific_units=this.materials[index].initial_specific_units;
    this.materials[index].percent=this.materials[index].initial_percent ;
    this.materials[index].units = this.materials[index].initial_units;
    this.materials[index].specific_units = this.materials[index].initial_specific_units;
      } 

  specificUnitsChange(target: any){
    const index = this.tblNavigator!.findRowSelect(target, 6);
    this.materials[index].specific_units = +target.value; 
  }

  unitsChange(target: any) {
    const index = this.tblNavigator!.findRowSelect(target, 5);
     this.materials[index].units = +target.value; 
  }

  async loadMaterials(materialtype: number, position: number, str?: string) {
    try {
      let data: IMaterials;
      if (str && str.length > 0) {
        const resultArray: string[] = [str];

        data = await this.appService.query('get', `http://localhost:3000/${this.nameController}/getMaterial/${materialtype}/${position}`, resultArray);
      } else {
        data = await this.appService.query('get', `http://localhost:3000/${this.nameController}/getMaterial/${materialtype}/${position}`);
      }
      this.materials!.length = 0;
      if ((data.materials as []).length !== 0) {
        this.materials = data.materials;
        for (const item of this.materials) {
          item.isEdited = false;
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  async updateMaterial(event: Event) {
    try {
      // 
      const percentPattern: RegExp =  /^\d{0,3}(?:\.\d{1,2})?$/ ;
      const numberPattern: RegExp = /^\d+$/;
      const index = this.tblNavigator!.findRowInsertedButton(event.target as HTMLButtonElement,8,0);
      const name_material = this.materials[index].name_material;
      const x1 = this.materials[index].x1;
      const x2 = this.materials[index].x2;
      const percent = this.materials[index].percent;
      const units=this.materials[index].units;
      const specific_units=this.materials[index].specific_units;
      const id_material = this.materials[index].idmaterial

      if (name_material === '') {
        alert('Не введено название материала!');
        return;
      }
      if (percent !== null) {
        if (percentPattern.test(String(percent)) === false) {
          alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
          return;
        }

      }

      if (x1 !== null && String(x1) !== '' && numberPattern.test(String(x1)) === false) {
        alert('Введите корректно значения характеристик! Допускаются только цифры!');
        return;

      }

      if (x2 !== null && String(x2) !== '' && numberPattern.test(String(x2)) === false) {
        alert('Введите корректно значения характеристик! Допускаются только цифры!');
        return;
      }
      const dataServer = {
        name_material: name_material,
        x1: x1 || null,
        x2: x2 || null,
        units:units,
        specific_units:specific_units,
        percent:percent,
        id_material: id_material
      }
      const data = await this.appService.query('put', `http://localhost:3000/${this.nameController}/updateMaterial`, dataServer);
      if (data.response === 'ok') {
        this.materials[index].isEdited = false;
        alert('Данные сохранены!');
        this.findMaterials();
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

  async saveNewMaterial() {
    try {
      const idmaterial_type = +(document.getElementById('selectMaterials') as HTMLSelectElement).value;
      const name_material = (document.getElementById('newMaterial') as HTMLInputElement).value;
      const x1 = (document.getElementById('x1') as HTMLInputElement).value;
      const weight = (document.getElementById('weight') as HTMLInputElement).value;
      const x2 = (document.getElementById('x2') as HTMLInputElement).value;
      const weightPttern: RegExp = /^\d{0,4}(?:\.\d{1,3})?$/;
      const numberPattern: RegExp = /^\d+$/;
      if (idmaterial_type === 1) {
        alert('Выберите тип материала!');
        return;
      } else if (name_material === '') {
        alert('Не введено название материала!');
        return;
      } else if (weight !== '') {
        if (weightPttern.test(weight) === false) {
          alert('Введите правильно массу! Допускается 4 цифры до точки и три цифры после точки!');
          return;
        }
      } else if (x1 !== '' && numberPattern.test(x1) === false) {
        alert('Введите корректно значения характеристик! Допускаются только цифры!');
        return;
      } else if (x2 !== '' && numberPattern.test(x2) === false) {
        alert('Введите корректно значения характеристик! Допускаются только цифры!');
        return;
      }
      const dataServer = {
        idmaterial_type: idmaterial_type,
        name_material: name_material,
        x1: +x1 || null,
        x2: +x2 || null,
        weight: +weight
      }
      const data = await this.appService.query('post',`'http://localhost:3000/${this.nameController}/addMaterial`, dataServer);
      if (data.response === 'ok') {
        alert('Позиция добавлена!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
      this.findMaterials();
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
      const id = this.materials[i].idmaterial;
      let data = await this.appService.query('get', `http://localhost:3000/${this.nameController}/isUsedMaterial/${id}`);
      if ((data as []).length > 0) {
        let answer = confirm(`Этот материал используется в базе чертежей. Его удаление приведет к остутсвию этого материала в использующих его чертежах и заказах. Вы ействительно хотите удалить даную позицию?`);
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
      data = await this.appService.query('delete', `http://localhost:3000/${this.nameController}/deleteMaterial`, [id]);
      if (data.response === 'ok') {
        this.findMaterials();
      }

    } catch (error: any) {
      alert(error);
    }
  }

  async onLoad() {
    try {
      const data: IMaterials = await this.appService.query('get', `http://localhost:3000/${this.nameController}/onLoad`);
      if ((data.material_type as []).length !== 0) {
        this.materialType = data.material_type;
      }

      if ((data.materials as []).length !== 0) {
        this.materials = data.materials;
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
    this.tblNavigator = new TableNavigator(document.getElementById('tblMaterials') as HTMLTableElement, 0);
  }
}
