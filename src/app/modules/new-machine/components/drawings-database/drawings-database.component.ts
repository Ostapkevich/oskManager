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
interface Ispecification{
  idDrawing:number,
  numberDrawing:string,
  nameDrawing:string,
  weight:number,
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
  isSpecification:boolean=true;
  typeMaterial: number = 1;// определяет какой радио выбран - прокат| метизы | метариалы | покупные
 

  @ViewChild(OthersComponent, { static: false })
  otherComponent: OthersComponent | undefined;
  @ViewChild(RolledComponent, { static: false })
  rolledComponent: RolledComponent | undefined;
  @ViewChild(HardwareComponent, { static: false })
  hardwareComponent: HardwareComponent | undefined;
  @ViewChild(PurchasedComponent, { static: false })
  purchasedComponent: PurchasedComponent | undefined;

  specificatios:string[]=[];
  materials: IaddMaterial[] = []; //материалы для данного чертежа
  tblNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  typeBlank: number | undefined;//прокат| метизы | метариалы | покупные - определяет тип добавленной заготовки
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
  percent!: number | null;
  value!: number | null;
  specific_units!: number | null;
  units!: number;
  percentMaterialBlank!: number | null;
  valueMaterialBlank!: number | null;
  specificUnitsMaterialBlank!: number | null;
  unitsMaterialBlank!: number;
  savePath: string[] = [];


  selectBlank(component: any, typeBlank: number) {
    const index = component.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      if (this.idBlank && confirm('Удалить текущую заготовку?') === true) {
        this.typeBlank = undefined;
        this.idBlank != undefined;
        this.nameBlank = '';
        return;
      } else {
        return;
      }
    }
    if (typeBlank === 3) {
      this.typeBlank = 3;
      this.nameBlank = this.otherComponent?.materials[index!].name_item!;
      this.idBlank = this.otherComponent?.materials[index!].id_item;
      this.specificUnitsMaterialBlank = this.otherComponent?.materials[index].specific_units!;
      this.percentMaterialBlank = this.otherComponent?.materials[index].percent!;
      this.unitsMaterialBlank = this.otherComponent?.materials[index].units!;
      (document.getElementById('selectCalculationBlank') as HTMLSelectElement).value = String(this.specificUnitsMaterialBlank);
      const modalElement: HTMLElement = document.querySelector('#blank-modal')!;
      const modalOptions: ModalOptions = {
        closable: true,
        backdrop: 'static',
      };
      this.calculateBlank();
      const modal = new Modal(modalElement, modalOptions)
      modal.show();

    } else {
      this.nameBlank = component?.materials[index!].name_item!;
      this.idBlank = component?.materials[index!].id_item;
      this.typeBlank = typeBlank;
    }

  }

  changRadioDraw() {
    if (confirm("Внимание! При смене типа чертежа введенные данные будут потеряны! Продолжить ?")===false) {
      return;
    }
    if ((document.getElementById('detail') as HTMLInputElement).checked === true) {
      (document.getElementById('sb') as HTMLInputElement).checked = false;
      this.isDetail=true;
    } 
  }


  changRadioSb() {
    if (confirm("Внимание! При смене типа чертежа введенные данные будут потеряны! Продолжить ?")===false) {
      return;
    }
    if ((document.getElementById('sb') as HTMLInputElement).checked === true) {
      (document.getElementById('detail') as HTMLInputElement).checked = false;
      this.isDetail=false;
    }
  }


  btnBlanklClick() {
    if (this.isDetail === false) {
      return;
    }
    let index: number;
    switch (this.typeMaterial) {
      case 1:
        this.selectBlank(this.rolledComponent, 1);
        break;
      case 2:
        this.selectBlank(this.hardwareComponent, 2);
        break;
      case 3:
        this.selectBlank(this.otherComponent, 3);
        break;
      case 4:
        this.selectBlank(this.purchasedComponent, 4);
        break;
    }
  }


  btnMaterialClick() {
    if ( this.typeMaterial !== 3) {
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
         this.materials.splice(index,1);
         return;
      }
    }
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


  addMaterail() {
    this.materials.push({
      id: this.idMaterial!,
      name_material: this.nameMaterial!,
      specific_units: this.specific_units!,
      x1: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      x2: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      percent: this.percent || null,
      value: this.specific_units === 3 ? this.value : null,
      units: this.units
    })
   
    this.closeModalMaterial();
  }

  closeModalBlank(toClose: boolean) {
    if (toClose === true) {
      this.nameBlank = '';
      this.idBlank = undefined;
    }

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
        this.value = this.percent! * this.m!;
        return;
      case 1:
        this.value = this.percent! * this.s!;
        return;
      case 2:
        this.value = +this.percent! + +this.len!;
        return;
    }
  }

  calculateBlank() {
    switch (this.specificUnitsMaterialBlank) {
      case 0:
        this.valueMaterialBlank = this.percentMaterialBlank! * this.m!;
        return;
      case 1:
        this.valueMaterialBlank = this.percentMaterialBlank! * this.s!;
        return;
      case 2:
        this.valueMaterialBlank = +this.percentMaterialBlank! + +this.len!;
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

  checkBoxBlankChange(targetElem: HTMLInputElement, element: HTMLInputElement) {
    switch (targetElem.name) {
      case 'blankInDwaw':
        if (targetElem.checked === true) {
          element.checked = false;
        }
        break;
      default:
        if (targetElem.checked === true) {
          element.checked = false;
        }
        break;
    }
  }

  changeSpecificMaterial() {
    this.specific_units = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
    this.calculateMaterial();
  }

  changeSpecificBlank() {
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
