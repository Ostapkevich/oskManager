import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { RolledComponent } from 'src/app/modules/materials/components/rolled/rolled.component';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from 'src/app/modules/materials/components/hardware/hardware.component';
import { OthersComponent } from 'src/app/modules/materials/components/others/others.component';
import { PurchasedComponent } from 'src/app/modules/materials/components/purchased/purchased.component';
import { Imaterial, ImaterialType, IMaterials } from 'src/app/modules/materials/components/others/iOthers';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { FormsModule } from '@angular/forms';
import { Modal, ModalOptions } from 'flowbite';
import { AppService } from 'src/app/app.service';

interface IaddMaterial {
  id: number | null,
  idDrawing: number | null,
  idItem: number | null,
  name_material: string,
  specific_units: number,
  x1: number | null,
  x2: number | null,
  percentMaterial: number | null,
  value: number | null,
  units: number
}
interface Ispecification {
  idDrawing: number,
  numberDrawing: string,
  nameDrawing: string,
  weight: number,
}

@Component({
  imports: [FormsModule, CommonModule, RolledComponent, HardwareComponent, OthersComponent, PurchasedComponent],
  standalone: true,
  selector: 'app-drawings-database',
  templateUrl: './drawings-database.component.html',
  styleUrls: ['./drawings-database.component.css']
})
export class DrawingsDatabaseComponent implements OnInit {
  constructor(private appService: AppService) { }

  isDetail: boolean = true;
  isSpecification: boolean = true;
  typeMaterial: number = 1;// определяет какой радио выбран - прокат| метизы | метариалы | покупные


  @ViewChild(OthersComponent, { static: false })
  otherComponent: OthersComponent | undefined;
  @ViewChild(RolledComponent, { static: false })
  rolledComponent: RolledComponent | undefined;
  @ViewChild(HardwareComponent, { static: false })
  hardwareComponent: HardwareComponent | undefined;
  @ViewChild(PurchasedComponent, { static: false })
  purchasedComponent: PurchasedComponent | undefined;

  specificatios: Ispecification[] = [];
  materials: IaddMaterial[] = []; //материалы для данного чертежа
  tblNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  // typeBlank: number | undefined;//прокат| метизы | метариалы | покупные - определяет тип добавленной заготовки
  idBlank: number | undefined; // id добавленной заготовки
  nameBlank: string = ''; // имя добавленной заготовки
  typeBlank: number | undefined; // для отрисовки шаблона заготовки в зависимости от выбранного типа заготовки
  nameMaterial: string | undefined; // имя добавленного материалы для чертежа
  idMaterial: number | undefined; // id добавленного материалы для чертежа
  id: number | undefined; // id  - уникальный ключ записи в таблице заготовки чертежа в ьазе данных
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

  async save() {
    try {

      /*  if (idmaterial_type === -1) {
         alert('Выберите тип материала!');
         return;
       }else if(+specific_units===-1 || +units===-1){
         alert('Выберите единицы измерения и "% от" !');
         return;
       } else if (name_material === '') {
         alert('Не введено название материала!');
         return;
       } else if (percent !== '') {
         if (percentPttern.test(percent) === false) {
           alert('Недопустимое значение "%". Допускается 3 цифры до точки и две цифры после точки!!');
           return;
         }
       } else if (x1 !== '' && numberPattern.test(x1) === false) {
         alert('Введите корректно значения характеристик! Допускаются только цифры!');
         return;
       } else if (x2 !== '' && numberPattern.test(x2) === false) {
         alert('Введите корректно значения характеристик! Допускаются только цифры!');
         return;
       } */
      const drawing: any[] = [];
      drawing.push(this.idDrawing || null);
      drawing.push(this.drawingNamber);
      drawing.push(this.isp || 0);
      drawing.push(this.drawingName);
      drawing.push(this.m || null);
      drawing.push(this.typeBlank);
      drawing.push(Boolean(this.materials));
      drawing.push(this.len || null, this.dw || null, this.h || null, this.s || null);

      let blank: any[] = [];
      switch (this.typeBlank) {
        case 1:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          blank.push(this.percentBlank);
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
          material.id||null,
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

  calculateBlank(index?: number) {
    if (this.typeMaterial === 3) {
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
    } else if (this.typeMaterial === 1) {
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
    if (this.isDetail === false) {
      return;
    }
    this.addBlankNotMaterial = true;
    let index: number;
    switch (this.typeMaterial) {
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


  btnMaterialClick() {
    if (this.typeMaterial !== 3) {
      return;
    }
    let index = this.otherComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.materials.length > 0) {
        if (!this.tblNavigator) {
          this.tblNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
        }
        index = this.tblNavigator!.findCheckedRowNumber();
        if (index) {
          this.materials.splice(index, 1);
        }
      }
      return;
    }
    this.addBlankNotMaterial = false;
    this.selectMaterial(index!);
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
    console.log('select Material specific_units ', this.specific_units)
    console.log('select Material units ', this.units)
    console.log('select Material percent ', this.percentMaterial)

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
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }

  addMaterail() {
    this.materials.push({
      id: null,
      idDrawing: this.idDrawing || null,
      idItem: this.idMaterial!,
      name_material: this.nameMaterial!,
      specific_units: this.specific_units!,
      x1: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      x2: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      percentMaterial: this.percentMaterial || null,
      value: this.specific_units === 3 ? this.valueBlank : null,
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


  changRadioDraw() {
    if (confirm("Внимание! При смене типа чертежа введенные данные будут потеряны! Продолжить ?") === false) {
      return;
    }
    if ((document.getElementById('detail') as HTMLInputElement).checked === true) {
      (document.getElementById('sb') as HTMLInputElement).checked = false;
      this.isDetail = true;
      this.specificatios.length = 0;
      this.materials.length = 0
    }
  }


  changRadioSb() {
    if (confirm("Внимание! При смене типа чертежа введенные данные будут потеряны! Продолжить ?") === false) {
      return;
    }
    if ((document.getElementById('sb') as HTMLInputElement).checked === true) {
      (document.getElementById('detail') as HTMLInputElement).checked = false;
      this.isDetail = false;
      this.materials.length = 0;
      //this.typeBlank = undefined;

    }
  }


  selectFiles() {
    const files = (document.getElementById('selectFiles') as HTMLInputElement).value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        // this.filePath.push(files[i].path);
      }
    }
    console.log(this.filePath);
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

  radioRolledComponent() {
    this.typeMaterial = 1;
  }

  radioHardwareComponent() {
    this.typeMaterial = 2;
  }

  radioMaterialComponent() {
    this.typeMaterial = 3;
  }

  radioPurshacedComponent() {
    this.typeMaterial = 4
  }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('numberDrawing')!.dispatchEvent(event);


  }
}
