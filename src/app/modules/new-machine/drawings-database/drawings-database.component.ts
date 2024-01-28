import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { RolledComponent } from 'src/app/modules/materials/rolled/rolled.component';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from 'src/app/modules/materials/hardware/hardware.component';
import { OthersComponent } from 'src/app/modules/materials/others/others.component';
import { PurchasedComponent } from 'src/app/modules/materials/purchased/purchased.component';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { FormsModule } from '@angular/forms';
import { Modal, ModalOptions } from 'flowbite';
import { AppService } from 'src/app/app.service';
import { ViewDrawingsComponent } from '../../views/view-drawings/view-drawings.component';

interface IaddMaterial {
  id: number | null,
  idDrawing: number | null,
  idItem: number | null,
  name_material: string,
  specific_units: number,
  percentMaterial: number | null,
  value: number | null,
  units: number
}
interface Ispecification {
  ind: number,
  type_position: number,
  id_item: number,
  numberDrawing: string,
  name_item: string,
  weight: number,
  quantity: number,
  useLenth: number,
  len: number,
  dw: number,
  h: number,
  specific_units: number,
  percentMaterial: number | null,
  value: number | null,
  units: number,
  plasma: boolean,
  unitsMaterial: number
}

@Component({
  imports: [FormsModule, CommonModule, RolledComponent, HardwareComponent, OthersComponent, PurchasedComponent, ViewDrawingsComponent],
  standalone: true,
  selector: 'app-drawings-database',
  templateUrl: './drawings-database.component.html',
  styleUrls: ['./drawings-database.component.css']
})
export class DrawingsDatabaseComponent implements OnInit {
  constructor(private appService: AppService) { }

  isDrawingInfo: boolean = true;
  radioMaterial: number = 1;// определяет какой радио выбран - прокат| метизы | метариалы | покупные


  @ViewChild(OthersComponent, { static: false })
  otherComponent: OthersComponent | undefined;
  @ViewChild(RolledComponent, { static: false })
  rolledComponent: RolledComponent | undefined;
  @ViewChild(HardwareComponent, { static: false })
  hardwareComponent: HardwareComponent | undefined;
  @ViewChild(PurchasedComponent, { static: false })
  purchasedComponent: PurchasedComponent | undefined;
  @ViewChild(ViewDrawingsComponent, { static: false })
  viewDrawingsComponent: ViewDrawingsComponent | undefined;

  specificatios: Partial<Ispecification>[] = [];
  materials: IaddMaterial[] = []; //материалы для данного чертежа
  tblNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  idBlank: number | undefined; // id добавленной заготовки
  nameBlank: string = ''; // имя добавленной заготовки
  typeBlank: number | undefined; // для отрисовки шаблона заготовки в зависимости от выбранного типа заготовки
  nameMaterial: string | undefined; // имя добавленного материалы для чертежа
  idMaterial: number | undefined; // id добавленного материалы для чертежа
  id: number | undefined; // id  - уникальный ключ строки в таблице заготовки чертежа в базе данных
  drawingNamber = '';
  drawingName = '';
  filePath: string[] = [];
  len: number | undefined;
  dw: number | undefined;
  h: number | undefined;
  s: number | undefined;
  m: number = 0;
  percentMaterial!: number | undefined;//коэф для материалов
  specific_units!: number | undefined;
  units!: number | undefined;
  percentBlank!: number | undefined;//коэф для заготовки
  valueBlank!: number;
  valueMaterial!: number | undefined;
  specificUnitsMaterialBlank!: number;
  unitsMaterialBlank!: number | undefined;
  savePath: string[] = [];
  blankWeight!: number;
  useLenth!: number;
  plasma: boolean = true;
  addBlankNotMaterial: boolean | undefined;
  idDrawing!: number | null;
  isp!: number | null;
  addSpesification: Partial<Ispecification> | undefined = {};


  async save() {
    try {
      if (this.drawingNamber === '') {
        alert("Введите номер чертежа!");
        return;
      }
      if (this.drawingName === '') {
        alert("Введите номер чертежа!");
        return;
      }
      if (this.m <= 0) {
        alert("Введите массу детали!");
        return;
      }
      if (!this.idBlank) {
        alert('Выберите вид заготовки!');
        return;
      }
      const files = (document.getElementById('selectFiles') as HTMLInputElement).files;
      if (!files || files.length === 0) {
        alert("Выберите файлы чертежей для сохранения!");
        return;
      }
      let path = (document.getElementById('selectPath') as HTMLSelectElement).value;
      if (path === '-1') {
        alert("Выберите путь для сохранения из выпадающего списка!");
        return;
      }

      if (this.typeBlank === 1) {
        if (this.useLenth === 1) {
          if (!this.len || this.len <= 0) {
            alert('Введите длину детали!');
            return;
          }

        } else {
          if (!this.dw || this.dw <= 0) {
            alert('Введите размер детали D/B!');
            return;
          }
          if (this.h && this.dw <= 0) {
            alert('Размер Н должен быть больше нуля!');
            return;
          }
          if (!this.h) {
            if (confirm('Ввести размер "Н" ?') === true) {
              return;
            }
          }
        }
      }
      if (this.typeBlank === 3) {
        if (this.specificUnitsMaterialBlank === 1 && (!this.s || this.s <= 0)) {
          alert('Введите площадь поверхности "S" !');
        }
      }
      if (this.typeBlank === 3) {
        if (this.specificUnitsMaterialBlank === 2 && (!this.len || this.len <= 0)) {
          alert('Введите размер "L" !');
        }
      }


      for (let i = 0; i < files.length; i++) {
        this.filePath.push(path + files[i].name);
      }

      const drawing: any[] = [];
      drawing.push(this.idDrawing || null);
      drawing.push(this.drawingNamber);
      drawing.push(this.isp || 0);
      drawing.push(this.drawingName);
      drawing.push(this.m || null);
      drawing.push(this.idBlank === undefined ? null : this.typeBlank);
      drawing.push(Boolean(this.materials.length > 0));
      drawing.push(this.len || null, this.dw || null, this.h || null, this.s || null);
      drawing.push(JSON.stringify(this.filePath));
      drawing.push(Boolean(this.specificatios.length > 0));
      let blank: any[] = [];
      switch (this.typeBlank) {
        case 1:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          blank.push(this.percentBlank);
          blank.push(this.plasma);
          break;
        case 2 || 4:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          break;
        case 3:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          blank.push(this.specificUnitsMaterialBlank === 3 ? null : this.percentBlank);
          blank.push(this.specificUnitsMaterialBlank === 3 ? this.valueBlank : null);
          blank.push(this.specificUnitsMaterialBlank);
          break;
      }
      let materialsServer: any[] = [];

      for (const material of this.materials) {
        materialsServer.push(
          material.id || null,
          this.idDrawing || null,
          material.idItem,
          material.percentMaterial || null,
          material.value || null,
          material.specific_units);
      }

      const dataServer = {
        drawing: drawing,
        blank: blank,
        materials: materialsServer.length > 0 ? materialsServer : null
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/saveDrawing/${this.typeBlank}`, dataServer);
      if (data.response === 'ok') {
        alert('Данные сохранены!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }

    } catch (error) {
      alert(error);
    }
  }


  selectPurchasedBlank() {
    const index = this.purchasedComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank = undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    this.typeBlank = 4;
    this.nameBlank = this.purchasedComponent?.materials[index!].name_item!;
    this.idBlank = this.purchasedComponent!.materials[index!].id_item;
    this.blankWeight = this.purchasedComponent!.materials[index!].percent;
  }

  selectHardwareBlank() {
    const index = this.hardwareComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank = undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    this.typeBlank = 2;
    this.nameBlank = this.hardwareComponent?.materials[index!].name_item!;
    this.idBlank = this.hardwareComponent!.materials[index!].id_item;
    this.blankWeight = this.hardwareComponent!.materials[index!].weight;

  }

  selectMaterialBlank() {
    const index = this.otherComponent?.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank = undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    this.typeBlank = 3;
    this.nameBlank = this.otherComponent?.materials[index!].name_item!;
    this.idBlank = this.otherComponent?.materials[index!].id_item;
    this.specificUnitsMaterialBlank = this.otherComponent?.materials[index!].specific_units!;
    this.unitsMaterialBlank = this.otherComponent?.materials[index!].units!;
    this.percentBlank = this.otherComponent?.materials[index!].percent!;
    (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specificUnitsMaterialBlank);
    const modalElement: HTMLElement = document.querySelector('#material-modal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateBlank();
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  }

  selectRolledBlank() {
    const index = this.rolledComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank = undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    this.typeBlank = 1;
    this.nameBlank = this.rolledComponent?.materials[index!].name_item!;
    this.idBlank = this.rolledComponent!.materials[index!].id_item;
    this.blankWeight = this.rolledComponent!.materials[index!].weight;
    this.useLenth = this.rolledComponent!.materials[index!].uselength;
    const modalElement: HTMLElement = document.querySelector('#rolled-modal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateBlank(index);
    const modal = new Modal(modalElement, modalOptions);
    modal.show();

  }

  selectRolledSpecification() {
    const index = this.rolledComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }

    this.addSpesification!.type_position = 1;
    this.addSpesification!.name_item = this.rolledComponent?.materials[index!].name_item!;
    this.addSpesification!.id_item = this.rolledComponent!.materials[index!].id_item;
    this.addSpesification!.weight = this.rolledComponent!.materials[index!].weight;
    this.addSpesification!.quantity = 1;
    this.addSpesification!.useLenth = this.rolledComponent!.materials[index!].uselength;
    this.addSpesification!.len = 0;
    this.addSpesification!.dw = 0;
    this.addSpesification!.h = 0;
    if (this.addSpesification!.useLenth === 0) {
      const t = this.rolledComponent!.materials[index!].t;
      if (t! < 9) {
        this.addSpesification!.plasma = false;
      } else {
        this.addSpesification!.plasma = true;
      }
    }
    const modalElement: HTMLElement = document.querySelector('#modalRolledSP')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
    //this.specificatios.push(this.addSpesification);
  }

  selectMaterialSpecification() {
    const index = this.otherComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    this.addSpesification!.type_position = 3;
    this.addSpesification!.name_item = this.otherComponent?.materials[index!].name_item!;
    this.addSpesification!.id_item = this.otherComponent!.materials[index!].id_item;
    this.addSpesification!.unitsMaterial = this.otherComponent?.materials[index!].units!;
    this.addSpesification!.value = 0;
    this.addSpesification!.quantity = 1;
    const modalElement: HTMLElement = document.querySelector('#modalRolledSP')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();

  }

  selectHardwareSpecification() {
    const index = this.hardwareComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    this.addSpesification!.type_position = 2;
    this.addSpesification!.name_item = this.hardwareComponent?.materials[index!].name_item!;
    this.addSpesification!.id_item = this.hardwareComponent!.materials[index!].id_item;
    this.addSpesification!.weight = this.hardwareComponent?.materials[index!].weight;
    this.addSpesification!.quantity = 1;
    const modalElement: HTMLElement = document.querySelector('#modalRolledSP')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();

  }

  calculateBlank(index?: number) {
    if (this.radioMaterial === 3) {
      switch (this.specificUnitsMaterialBlank) {
        case 0:
          this.valueBlank = this.percentBlank! * this.m!;
          return;
        case 1:
          this.valueBlank = this.percentBlank! * this.s!;
          return;
        case 2:
          this.valueBlank = +this.percentBlank! + +this.len!;
          return;
      }
    } else if (this.radioMaterial === 1) {
      if (this.useLenth === 0) {
        const t = this.rolledComponent!.materials[index!].t;
        if (t! < 9) {
          this.plasma = false;
          this.percentBlank = 10;
        } else if (t! < 20) {
          this.percentBlank = 15;
        } else if (t! < 30) {
          this.percentBlank = 20;
        } else if (t! < 40) {
          this.percentBlank = 25;
        } else {
          this.percentBlank = 30;
        }
      } else {
        // this.valueBlank = this.rolledWeight * this.len! / 1000000;
        const d = this.rolledComponent!.materials[index!].d;
        if (d! < 150) {
          this.percentBlank = 10;
        } else {
          this.percentBlank = 15;
        }
      }

    } else {

    }

  }

  btnBlanklClick() {
    if (this.isDrawingInfo) {
      if (this.idBlank && confirm('Удалить заготовку?') === true) {
        this.idBlank = undefined;
      }
      return;
    } else {
      this.addBlankNotMaterial = true;
      let index: number;
      switch (this.radioMaterial) {
        case 1:
          this.selectRolledBlank();
          break;
        case 2:
          this.selectHardwareBlank();
          break;
        case 3:
          this.selectMaterialBlank();
          break;
        case 4:
          this.selectPurchasedBlank();
          break;
      }
    }

  }

  btnMaterialClick() {
    if (this.isDrawingInfo) {
      if (this.materials.length > 0) {
        if (!this.tblNavigator) {
          this.tblNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
        }
        const index = this.tblNavigator!.findCheckedRowNumber();
        if (index !== null && confirm('Удалить выбранный материал?') === true) {
          this.materials.splice(index, 1);
        }
      }
      return;
    } else {
      if (this.radioMaterial !== 3) {
        return;
      }
      let index = this.otherComponent!.tblNavigator?.findCheckedRowNumber();
      if (index === null) {
        return;
      }
      this.addBlankNotMaterial = false;
      this.selectMaterial(index!);
    }

  }

  btnSpecificationClick() {
    if (!this.isDrawingInfo) {

      const item: Partial<Ispecification> = {}
      switch (this.radioMaterial) {
        case 1:
          this.selectRolledSpecification();
          break;
        case 2:
          this.selectHardwareSpecification();
          break;
        case 3:
          this.selectMaterialSpecification();
          break;

        default:
          break;
      }
    } else {

    }
  }

  selectMaterial(index: number) {
    this.nameMaterial = this.otherComponent?.materials[index].name_item!;
    this.idMaterial = this.otherComponent?.materials[index].id_item;
    this.specific_units = this.otherComponent?.materials[index].specific_units!;
    this.units = this.otherComponent?.materials[index].units!;
    this.percentMaterial = this.otherComponent?.materials[index].percent!;
    (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specific_units);
    const modalElement: HTMLElement = document.querySelector('#material-modal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateMaterial();
    const modal = new Modal(modalElement, modalOptions)
    modal.show();
  }

  calculateMaterial() {
    switch (this.specific_units) {
      case 0:
        this.valueMaterial = this.percentMaterial! * this.m!;
        return;
      case 1:
        this.valueMaterial = this.percentMaterial! * this.s!;
        return;
      case 2:
        this.valueMaterial = +this.percentMaterial! + +this.len!;
        return;
    }
  }

  addBlank() {
    if (this.typeBlank === 3) {
      if (this.specificUnitsMaterialBlank === 0 && (!this.m || this.m <= 0)) {
        alert('Введите массу детали "m" !');
        return;
      }
      if (this.specificUnitsMaterialBlank === 2 && (!this.len || this.len <= 0)) {
        alert('Введите размер "L" !');
        return;
      }
      if (this.specificUnitsMaterialBlank === 1 && (!this.s || this.s <= 0)) {
        alert('Введите площадь поверхности "S" !');
        return;
      }
    } else if (this.typeBlank === 1) {
      if (this.useLenth === 1) {
        if (!this.len || this.len <= 0) {
          alert('Введите размер "L" !');
          return;
        }

      } else {
        if (!this.dw || this.dw <= 0) {
          alert('Введите размер детали D/B!');
          return;
        }
        if (this.h && this.dw <= 0) {
          alert('Размер Н должен быть больше нуля!');
          return;
        }
        if (!this.h) {
          if (confirm('Ввести размер "Н" ?') === true) {
            return;
          }
        }
      }

      if (!this.percentBlank || this.percentBlank <= 0) {
        alert('Введите припуск!');
        return;
      }
    }
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }

  addBlankSP() {
    if (!this.addSpesification?.quantity || this.addSpesification?.quantity <= 0) {
      alert('Введите количество, шт!');
      return;
    }
    if (this.addSpesification!.type_position === 3) {
      if (!this.addSpesification?.value || this.addSpesification?.value <= 0) {
        alert('Введите количество материала!');
        return;
      }
    } else if (this.addSpesification!.type_position === 1) {
      if (this.addSpesification!.useLenth === 1) {
        if (!this.addSpesification!.len || this.addSpesification!.len <= 0) {
          alert('Введите размер "L" !');
          return;
        }
      } else {
        if (!this.addSpesification!.dw || this.addSpesification!.dw <= 0) {
          alert('Введите размер детали D/B!');
          return;
        }
        if (this.addSpesification!.h && this.addSpesification!.dw <= 0) {
          alert('Размер Н должен быть больше нуля!');
          return;
        }
        if (!this.addSpesification!.h) {
          if (confirm('Ввести размер "Н" ?') === true) {
            return;
          }
        }
      }
    }
    this.specificatios.push(Object.assign(new Object(), this.addSpesification!));
    this.closeModalRolledSP();

  }

  addMaterail() {
    if (this.specific_units === 0 && (!this.m || this.m <= 0)) {
      alert('Введите массу детали "m" !');
      return;
    }
    if (this.specific_units === 2 && (!this.len || this.len <= 0)) {
      alert('Введите размер "L" !');
      return;
    }
    if (this.specific_units === 1 && (!this.s || this.s <= 0)) {
      alert('Введите площадь поверхности "S" !');
      return;
    }

    this.materials.push({
      id: null,
      idDrawing: this.idDrawing || null,
      idItem: this.idMaterial!,
      name_material: this.nameMaterial!,
      specific_units: this.specific_units!,
      percentMaterial: this.specific_units === 3 ? null : this.percentMaterial || null,
      value: this.specific_units === 3 ? +(document.getElementById('amountMaterial') as HTMLInputElement).value : this.valueBlank,
      units: this.units!
    })
    this.closeModalMaterial();
  }

  closeModalRolled() {
    this.nameBlank = '';
    this.idBlank = undefined;
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }

  closeModalRolledSP() {

    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modalFormRolledSP') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }


  closeModalMaterial() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormmaterial') as HTMLFormElement).dispatchEvent(keyboardEvent);
    this.specific_units = undefined;
    this.percentMaterial = undefined;
    this.units = undefined;
    this.valueMaterial = undefined;
  }

  checkBoxIspChange(element: any) {
    if ((element as HTMLInputElement).checked) {
      (document.getElementById('inpIsp') as HTMLInputElement).disabled = false;
    } else {
      const inp: any = document.getElementById('inpIsp');
      inp.disabled = true;
      inp.value = '';
    }
  }

  changeMethodMaterial() {

    this.specific_units = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
    if (this.addBlankNotMaterial === true) {
      this.specificUnitsMaterialBlank = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateBlank();
    } else {
      this.specific_units = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateMaterial();
    }

  }

  changeMethodRolled() {
    this.specificUnitsMaterialBlank = +(document.getElementById('selectCalculationBlank') as HTMLInputElement).value;
    this.calculateBlank();
  }


   changeRadio(element: HTMLInputElement, type: number) {
    this.radioMaterial = type;
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
      if (radioButton !== element) {
        (radioButton as HTMLInputElement).checked = false;
      }
    });
  };

/* infoPanelOrAddDataPanel(isDrawingInfo:boolean){
  this.isDrawingInfo=isDrawingInfo;
  switch (this.radioMaterial) {
    case 1:
      (document.getElementById('roll') as HTMLInputElement).checked===true
      break;
  
    default:
      break;
  }
} */

  async scan() {
    try {

      const data = await this.appService.query('get', `http://localhost:3000/drawings/scan`);
      this.savePath = data.scan;
    } catch (error) {
      alert(error);
    }
  }


  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('numberDrawing')!.dispatchEvent(event);
    this.scan();

  }
}
