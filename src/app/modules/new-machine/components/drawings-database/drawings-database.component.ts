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
  id: number;
  name_material: string;
  specific_units: number;
  x1: number | null;
  x2: number | null;
  percent: number | null;
  value: number | null;
  units: number;
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
  nameMaterial: string | undefined; // имя добавленного материалы для чертежа
  idMaterial: number | undefined; // id добавленного материалы для чертежа
  drawingNamber = '';
  drawingName = '';
  filePath: string[] = [];
  len: number | undefined;
  dw: number | undefined;
  h: number | undefined;
  s: number | undefined;
  m: number = 0;
  percent!: number | null;//коэф для материалов
  specific_units!: number | null;
  units!: number |null;
  percentBlank!: number | null;//коэф для заготовки
  valueBlank!: number | null;
  specificUnitsMaterialBlank!: number;
  unitsMaterialBlank!: number;
  savePath: string[] = [];
  rolledWeight!: number;
  useLenth!: number;
  plasma: boolean = true;
  addBlankNotMaterial: boolean | undefined;


  selectPurchasedBlank() { }

  selectHardwareBlank() { }

  selectMaterialBlank() {
    const index = this.otherComponent?.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank != undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    if (this.typeMaterial === 3) {
      this.nameBlank = this.otherComponent?.materials[index!].name_item!;
      this.idBlank = this.otherComponent?.materials[index!].id_item;
      this.specificUnitsMaterialBlank = this.otherComponent?.materials[index!].specific_units!;
      this.percentBlank = this.otherComponent?.materials[index!].percent!;
      this.unitsMaterialBlank = this.otherComponent?.materials[index!].units!;
      (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specificUnitsMaterialBlank);
      const modalElement: HTMLElement = document.querySelector('#material-modal')!;
      const modalOptions: ModalOptions = {
        closable: true,
        backdrop: 'static',
      };
      this.calculateBlank();
      const modal = new Modal(modalElement, modalOptions)
      modal.show();
    }
  }


  selectRolledBlank() {
    const index = this.rolledComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.idBlank != undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    this.nameBlank = this.rolledComponent?.materials[index!].name_item!;
    this.idBlank = this.rolledComponent!.materials[index!].id_item;
    this.rolledWeight = this.rolledComponent!.materials[index!].weight;
    this.useLenth = this.rolledComponent!.materials[index!].uselength;
    const modalElement: HTMLElement = document.querySelector('#rolled-modal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateBlank(index);
    const modal = new Modal(modalElement, modalOptions)
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
      }

    } else {
      this.valueBlank = this.rolledWeight * this.len! / 1000000;
      const d = this.rolledComponent!.materials[index!].d;
      if (d! < 150) {
        this.percentBlank = 10;
      } else {
        this.percentBlank = 15;
      }
    }

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
      if (!this.tblNavigator) {
        this.tblNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
      }
      index = this.tblNavigator!.findCheckedRowNumber();
      if (index === null) {
        return;
      } else {
        this.materials.splice(index, 1);
        return;
      }
    }
    this.addBlankNotMaterial = false;
    this.selectMaterial(index!);
  }

  selectMaterial(index: number) {
    this.nameMaterial = this.otherComponent?.materials[index].name_item!;
    this.specific_units = this.otherComponent?.materials[index].specific_units!;
    this.percent = this.otherComponent?.materials[index].percent!;
    this.idMaterial = this.otherComponent?.materials[index].id_item;
    (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specific_units);
    this.units = this.otherComponent?.materials[index].units!;
    const modalElement: HTMLElement = document.querySelector('#material-modal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateMaterial();
    const modal = new Modal(modalElement, modalOptions)
    modal.show();
  }

  addBlank() {
    if (this.typeMaterial===3) {
      this.valueBlank = +(document.getElementById('amountMaterial') as HTMLInputElement).value;
    } else {
      this.valueBlank = +(document.getElementById('amountBlank') as HTMLInputElement).value;
    }
    
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }

  addMaterail() {
    this.materials.push({
      id: this.idMaterial!,
      name_material: this.nameMaterial!,
      specific_units: this.specific_units!,
      x1: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      x2: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      percent: this.percent || null,
      value: this.specific_units === 3 ? this.valueBlank : null,
      units: this.units!
    })
    this.specific_units = null;
    this.percent=null;
    this.units=null;
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
  }

  calculateMaterial() {
    switch (this.specific_units) {
      case 0:
        this.valueBlank = this.percent! * this.m!;
        return;
      case 1:
        this.valueBlank = this.percent! * this.s!;
        return;
      case 2:
        this.valueBlank = +this.percent! + +this.len!;
        return;
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
    this.calculateMaterial();
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
