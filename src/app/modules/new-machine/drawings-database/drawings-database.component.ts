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
import { NgForm } from '@angular/forms';
import { Ispecification, IaddMaterial, IBlank } from './interfaceDrawingSP';

//import { DrawingService} from './drawing.service';
//import { DrawingSpService } from '../../views/drawingSP/drawingSp.service';



@Component({
  imports: [FormsModule, CommonModule, RolledComponent, HardwareComponent, OthersComponent, PurchasedComponent, ViewDrawingsComponent],
  standalone: true,
  providers: [],
  selector: 'app-drawings-database',
  templateUrl: './drawings-database.component.html',
  styleUrls: ['./drawings-database.component.css'],
})
export class DrawingsDatabaseComponent implements OnInit {
  constructor(private appService: AppService) { }

  dataChanged: boolean | null | undefined = false;
  //blankChange:boolean=false;
  materialChange: boolean = false;
  spChange: boolean = false;
  isDrawingInfo: boolean = true;
  radioMaterial: number = 1;// определяет какой радио выбран - прокат| метизы | метариалы | покупные
  changedData = false;
  //oldTypeBlank: number | undefined;



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

  /* Чертеж */
  idDrawing!: number | undefined;
  savePath: string[] = []; // Выбор пути в select для сохранения
  s: number | undefined;//Масса чертежа
  m: number | undefined;
  drawingNamber = '';
  drawingName = '';
  filePath: string[] = []; // массив путей где будут хранится чертежи

  /* Заготовка */
  blank: Partial<IBlank> | undefined;
  tempBlank: Partial<IBlank> | undefined;
  btnEditBlank: boolean = false;
  btnEditMaterial: boolean = false;
  /* Материал */
  materialNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  materials: Partial<IaddMaterial>[] = []; //материалы для данного чертежа
  material: Partial<IaddMaterial> = {};

  /* Сп */
  specificatios: Partial<Ispecification>[] = [];
  spNavigator: TableNavigator | undefined;
  addSpesification: Partial<Ispecification> | undefined = {};
  selectedPositionSP: number | undefined;


  addBlankNotMaterial: boolean | undefined;
  //focusedTable: HTMLTableElement | null = null;

  changeRadio(element: HTMLInputElement, type: number) {
    this.radioMaterial = type;
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
      if (radioButton !== element) {
        (radioButton as HTMLInputElement).checked = false;
      }
    });
  };

  async scan() {
    try {

      const data = await this.appService.query('get', `http://localhost:3000/drawings/scan`);
      this.savePath = data.scan;
    } catch (error) {
      alert(error);
    }
  }


  formChange(dataForm: NgForm) {
    this.dataChanged = dataForm.dirty;

  }


  ngOnInit() {
    let event = new Event("click");
    document.getElementById('numberDrawing')!.dispatchEvent(event);
    this.scan();

  }


  async saveAll() {
    try {
      if (this.drawingNamber === '') {
        alert("Введите номер чертежа!");
        return;
      }
      if (this.drawingName === '') {
        alert("Введите номер чертежа!");
        return;
      }
      if (!this.m || this.m <= 0) {
        alert("Введите массу детали!");
        return;
      }
      if (!this.blank!.idBlank) {
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

      if (this.blank!.typeBlank === 1) {
        if (this.blank!.uselength === 1) {
          if (!this.blank!.len || this.blank!.len <= 0) {
            alert('Введите длину детали!');
            return;
          }

        } else {
          if (!this.blank!.dw || this.blank!.dw <= 0) {
            alert('Введите размер детали D/B!');
            return;
          }
          if (this.blank!.h && this.blank!.dw <= 0) {
            alert('Размер Н должен быть больше нуля!');
            return;
          }
          if (!this.blank!.h) {
            if (confirm('Ввести размер "Н" ?') === true) {
              return;
            }
          }
        }
      }
      if (this.blank!.typeBlank === 3) {
        if (this.blank!.specificUnitsBlank === 1 && (!this.s || this.s <= 0)) {
          alert('Введите площадь поверхности "S" !');
        }
      }
      for (let i = 0; i < files.length; i++) {
        this.filePath.push(path + files[i].name);
      }
      const drawing: any[] = [];
      drawing.push(this.idDrawing || null);
      drawing.push(this.drawingNamber);
      //drawing.push(this.isp || 0);
      drawing.push(this.drawingName);
      drawing.push(this.m || null);
      drawing.push(this.blank!.idBlank === undefined ? null : this.blank!.typeBlank);
      drawing.push(Boolean(this.materials.length > 0));
      drawing.push(this.s || null);
      drawing.push(JSON.stringify(this.filePath));
      drawing.push(Boolean(this.specificatios.length > 0));
      let blank: any[] = [];
      switch (this.blank!.typeBlank) {
        case 1:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.blank!.idBlank);
          blank.push(this.blank!.percentBlank);
          blank.push(this.blank!.uselength ? null : this.blank!.plasma);
          blank.push(this.blank!.len || null, this.blank!.dw || null, this.blank!.h || null);
          break;
        case 2:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.blank!.idBlank);
          break;
        case 3:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.blank!.idBlank);
          blank.push(this.blank!.specificUnitsBlank === 3 ? null : this.blank!.percentBlank);
          blank.push(this.blank!.specificUnitsBlank === 3 ? this.blank!.valueBlank : null);
          blank.push(this.blank!.specificUnitsBlank);
          blank.push(this.blank!.len || null, this.blank!.h || null)
          break;
        case 4:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.blank!.idBlank);
          break;
      }
      const materialsServer: any[] = [];

      for (const material of this.materials) {
        materialsServer.push(
          material.id || null,
          this.idDrawing || null,
          material.idItem,
          material.percent || null,
          material.valueMaterial || null,
          material.specific_units,
          material.lenMaterial || null,
          material.hMaterial || null
        );
      }

      const spServer: any[] = [];
      for (const item of this.specificatios) {

      }
      const dataServer = {
        drawing: drawing,
        blank: blank.length > 0 ? blank : null,
        materials: materialsServer.length > 0 ? materialsServer : null,
        specificatios: spServer.length > 0 ? spServer : null,
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/saveDrawing/${this.blank!.typeBlank}`, dataServer);
      if (data.response === 'ok') {
        alert('Данные сохранены!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }

    } catch (error) {
      alert(error);
    }
  }

  preparingTosaveDrawing() {
    if (this.drawingNamber === '') {
      alert("Введите номер чертежа!");
      return;
    }
    if (this.drawingName === '') {
      alert("Введите номер чертежа!");
      return;
    }
    if (!this.m || this.m <= 0) {
      alert("Введите массу детали!");
      return;
    }
    let path = (document.getElementById('selectPath') as HTMLSelectElement).value;
    if (path === '-1') {
      alert("Выберите путь для сохранения из выпадающего списка!");
      return;
    }
    const inputFiles = (document.getElementById('selectFiles') as HTMLInputElement).files;
    if (inputFiles && inputFiles.length > 0) {
      for (let i = 0; i < inputFiles.length; i++) {
        this.filePath.push(path + '\\' + inputFiles[i].name);
      }
    } else {
      if (this.filePath.length > 0) {
        const oldPath = this.filePath[0].substring(0, this.filePath[0].lastIndexOf('\\'));
        if (oldPath !== path) {
          this.filePath = this.filePath.map(function (item) { return item.replace(oldPath, path) })
        }
      } else {
        //(document.getElementById('selectPath') as HTMLSelectElement).value = this.filePath[0].substring(0, this.filePath[0].lastIndexOf('\\'));
        alert("Выберите файлы чертежей для сохранения!");
        return;
      }
    }
    if (this.idDrawing && this.drawingNamber !== (document.getElementById('numberDrawing') as HTMLInputElement).value) {
    //  this.showSaveModal();
    const modalElement: HTMLElement = document.querySelector('#saveModal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
    } else {
      this.saveDrawing();
    }

  }

  async saveDrawing() {
    try {
      const numberDraw = (document.getElementById('numberDrawing') as HTMLInputElement).value;
      const drawing: any[] = [];
      drawing.push(this.idDrawing);
      drawing.push(numberDraw);
      drawing.push(this.drawingName);
      drawing.push(this.m);
      drawing.push(this.s || null);
      drawing.push(JSON.stringify(this.filePath));
      const data = await this.appService.query('post', `http://localhost:3000/drawings/saveDrawing`, drawing);
      if (typeof data.response === 'number') {
        this.idDrawing = data.response;
        this.drawingNamber = numberDraw;
        alert('Данные сохранены!');
        this.dataChanged=false;
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }

    } catch (error) {
      alert(error);
    }
  }

  async saveBlank() {
    try {
      const blank: any[] = [];
      switch (this.blank!.typeBlank) {
        case 1:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing);
          blank.push(this.blank!.idBlank);
          blank.push(this.blank!.uselength === 1 ? this.blank!.len : null);
          blank.push(this.blank!.uselength === 1 ? null : this.blank!.dw);
          blank.push(this.blank!.uselength === 1 ? null : this.blank!.h);
          blank.push(this.blank!.plasma);
          blank.push(this.blank!.percentBlank);
          this.blank!.len = this.blank!.uselength === 1 ? this.blank!.len : undefined;
          this.blank!.dw = this.blank!.uselength === 1 ? undefined : this.blank!.dw;
          this.blank!.h = this.blank!.uselength === 1 ? undefined : this.blank!.h;
          break;
        case 2:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing);
          blank.push(this.blank!.idBlank);
          break;
        case 3:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing);
          blank.push(this.blank!.idBlank);
          blank.push(this.blank!.specificUnitsBlank === 3 ? null : this.blank!.percentBlank);
          blank.push(this.blank!.specificUnitsBlank === 3 ? this.blank!.valueBlank : null);
          blank.push(this.blank!.specificUnitsBlank);
          blank.push(this.blank!.len || null, this.blank!.h || null)
          break;
        case 4:
          blank.push(this.blank!.id || null);
          blank.push(this.idDrawing);
          blank.push(this.blank!.idBlank);
          break;
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/saveBlank/${this.blank!.typeBlank}`, blank);
      if (data.id) {
        this.blank!.id = data.id;
        alert('Данные сохранены!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

 /*  showSaveModal() {
    const modalElement: HTMLElement = document.querySelector('#saveModal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  } */

  closeSaveDrawingModal() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#saveModal') as HTMLDivElement).dispatchEvent(keyboardEvent);
  }

  saveDrawingModal() {
    this.closeSaveDrawingModal();
    this.saveDrawing();
  }

  saveAsDrawingModal() {
    this.closeSaveDrawingModal();
    this.saveAll();
  }

  showDrawingInfo(drawingInfo: any) {
    if (drawingInfo) {
      this.idDrawing = drawingInfo.idDrawing;
      this.drawingNamber = drawingInfo.numberDrawing;
      this.drawingName = drawingInfo.nameDrawing;
      this.m = drawingInfo.weight;
      this.s = drawingInfo.s;
      if (drawingInfo.path && drawingInfo.path.length > 0) {
        this.filePath = drawingInfo.path;
      }
      (document.getElementById('lblCountFiles') as HTMLLabelElement).innerText = ` ${this.filePath.length} шт.`;
      const path = this.filePath[0].substring(0, this.filePath[0].lastIndexOf('\\'));
      const ind = this.savePath.indexOf(path);
      if (ind === -1) {
        alert(`Путь расположения Файлов чертежей '${path}' не принадлежит какому либо варианту из списка путей сохранения!`)
      } else {
        (document.getElementById('selectPath') as HTMLSelectElement).value = this.filePath[0].substring(0, this.filePath[0].lastIndexOf('\\'));
      }
    } else {
      (document.getElementById('lblCountFiles') as HTMLLabelElement).innerText = ` 0 шт.`;
    }
  }

  showBlankInfo(blankInfo: any, type_blank: number | null) {
    if (blankInfo) {
      this.blank = {};
      this.blank!.typeBlank = type_blank!;
      this.blank!.id = blankInfo.id;
      this.blank!.idBlank = blankInfo.id_item;
      this.blank!.blankWeight = blankInfo.weight;
      this.blank!.nameBlank = blankInfo.name_item;
      switch (this.blank!.typeBlank) {
        case 1:
          this.blank!.uselength = blankInfo.uselength;
          this.blank!.len = blankInfo.L;
          this.blank!.dw = blankInfo.d_b;
          this.blank!.h = blankInfo.h;
          this.blank!.plasma = Boolean(blankInfo.plasma);
          this.blank!.percentBlank = blankInfo.allowance
          break;
        case 3:
          this.blank!.len = blankInfo.L;
          this.blank!.h = blankInfo.h;
          this.blank!.percentBlank = blankInfo.percent;
          this.blank!.valueBlank = blankInfo.value;
          this.blank!.specificUnitsBlank = blankInfo.specific_units;
          this.blank!.unitsBlank = blankInfo.units;
          break;
      }
    }
  }

  showMaterialInfo(materialInfo: any) {
    if (materialInfo) {
      for (const item of materialInfo) {
        this.materials.push({
          id: item.id,
          idDrawing: item.idDrawing,
          idItem: item.id_item,
          name_material: item.name_item,
          unitsMaterial: item.units,
          percent: item.percent,
          valueMaterial: item.value,
          specific_units: item.specific_units,
          lenMaterial: item.L,
          //dw: this.dwMaterial || null,
          hMaterial: item.h,
        })
      }
    }
  }

  async getDrawingInfoFull(idOrNumber: number | string, findBy: 'id' | 'number') {
    try {
      let data: any;
      data = await this.appService.query('get', `http://localhost:3000/drawings/getDrawingInfoFull/${idOrNumber}/${findBy}`);
      // const tempIdDrawind = (document.getElementById('idDrawing') as HTMLInputElement).value;
      this.clearDrawing();
      this.blank = undefined;
      this.clearMaterial();
      this.specificatios.length = 0;
      if (data.notFound) {
        setTimeout(() => alert('Чертеж не найден!'));
        return;
      }
      this.showDrawingInfo(data.drawing)
      this.specificatios.length = 0;
      this.showBlankInfo(data.blank, data.drawing.type_blank);
      this.showMaterialInfo(data.materials);
      if (data.positionsSP) {
        this.specificatios = data.positionsSP;
      }
      this.dataChanged = false;
      //this.blankChange=false;
      this.materialChange = false;
      this.spChange = false;
    } catch (error) {
      alert(error);
    }

  }

  inputEnter(event?: any) {
    if (event?.key === 'Enter') {
      const idElem = document.getElementById('idDrawing');
      const numberElem = document.getElementById('numberDrawing');
      let data: any;
      if (event?.target === numberElem) {
        const number = (numberElem as HTMLInputElement).value;
        this.getDrawingInfoFull(number, 'number');
      } else {
        const id = +(idElem as HTMLInputElement).value
        this.getDrawingInfoFull(id, 'id');
      }
    }
  }

  clearDrawing() {
    (document.getElementById('selectPath') as HTMLSelectElement).value = '-1';
    this.idDrawing = undefined;
    this.drawingNamber = '';
    this.drawingName = '';
    this.m = undefined;
    this.s = undefined;
    this.filePath.length = 0;
  }



  clearMaterial() {
    this.materials.length = 0;
  }

  selectFiles() {
    this.filePath.length = 0;
    const count = (document.getElementById('selectFiles') as HTMLInputElement).files!.length;
    (document.getElementById('lblCountFiles') as HTMLLabelElement).innerText = ` ${count} шт.`;
  }

  btnBlanklClick() {
    if (this.isDrawingInfo) {
      if (this.blank && confirm('Удалить заготовку?') === true) {
        this.deleteBlank();
      }
      return;
    } else {
      if (this.blank) {
        this.tempBlank = this.blank;
      }
      this.blank = {};
      this.addBlankNotMaterial = true;
      let index: number;
      switch (this.radioMaterial) {
        case 1:
          this.blank!.typeBlank = 1;
          this.selectBlank(this.rolledComponent!, '#rolled-modal');
          //this.deleteBlank();
          break;
        case 2:
          this.blank!.typeBlank = 2;
          this.changedData = true;
          this.selectBlank(this.hardwareComponent!);
          this.deleteBlank();
          this.saveBlank();
          break;
        case 3:
          this.blank!.typeBlank = 3;
          this.selectBlank(this.otherComponent!, '#material-modal');
          //this.deleteBlank();
          break;
        case 4:
          this.blank!.typeBlank = 4;
          this.changedData = true;
          this.selectBlank(this.purchasedComponent!);
          this.deleteBlank();
          this.saveBlank();
          break;
      }
    }
  }

  async deleteBlank() {
    try {
      if (this.isDrawingInfo) {
        const data = await this.appService.query('delete', `http://localhost:3000/drawings/deleteBlank/${this.blank?.typeBlank}/${this.blank!.id}/${this.idDrawing}/${null}`);
        if (data.response === 'ok') {
          this.blank = undefined;
          alert('Заготовка удалена');
        } else {
          alert('Что-то пошло не так!');
        }
      } else {
        if (!this.tempBlank) {
          return;
        }
        if (this.blank && this.blank!.typeBlank !== this.tempBlank?.typeBlank) {
          const data = await this.appService.query('delete', `http://localhost:3000/drawings/deleteBlank/${this.tempBlank?.typeBlank}/${this.tempBlank!.id}/${this.idDrawing}/${this.blank!.typeBlank}`);
          if (data.response !== 'ok') {
            alert('Что-то пошло не так!');
          }
        }
      }

    } catch (error) {
      alert(error)
    }

  }

  selectBlank(materialComponent: any, idModal?: string) {
    const index = materialComponent?.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    if (this.blank?.id !== undefined && confirm('Чертеж уже содержит заготовку! Заменить заготовку?') === false) {
      return;
    }

    this.blank!.nameBlank = materialComponent.collections[index!].name_item!;
    this.blank!.idBlank = materialComponent.collections[index!].id_item;
    if (materialComponent !== this.otherComponent) {
      this.blank!.blankWeight = materialComponent.collections[index!].weight;
      if (materialComponent === this.hardwareComponent || materialComponent === this.purchasedComponent) {
        return;
      }
      if (materialComponent === this.rolledComponent) {
        this.blank!.uselength = this.rolledComponent!.collections[index!].uselength;
      }
    } else {
      this.blank!.specificUnitsBlank = this.otherComponent?.collections[index!].specific_units!;
      this.blank!.unitsBlank = this.otherComponent?.collections[index!].units!;
      this.blank!.percentBlank = this.otherComponent?.collections[index!].percent!;
      (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.blank!.specificUnitsBlank);
    }
    const modalElement: HTMLElement = document.querySelector(idModal!)!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    this.calculateBlank(index);
    const modal = new Modal(modalElement, modalOptions);

    modal.show();
  }

  calculateBlank(index?: number) {
    if (this.radioMaterial === 3) {
      switch (this.blank!.specificUnitsBlank) {
        case 0:
          this.blank!.valueBlank = this.blank!.percentBlank! * this.m!;
          return;
        case 1:
          this.blank!.valueBlank = this.blank!.percentBlank! * this.s!;
          return;
        case 2:
          if (this.blank!.unitsBlank === 1) {
            this.blank!.valueBlank = (this.blank!.h! * this.blank!.len!) / 1000000;
          }
          return;
      }
    } else if (this.radioMaterial === 1) {
      if (this.blank!.uselength === 0) {
        const t = this.rolledComponent!.collections[index!].t!;
        if (t! < 9) {
          this.blank!.plasma = false;
          this.blank!.percentBlank = 10;
        } else if (t! < 20) {
          this.blank!.percentBlank = 15;
        } else if (t! < 30) {
          this.blank!.percentBlank = 20;
        } else if (t! < 40) {
          this.blank!.percentBlank = 25;
        } else {
          this.blank!.plasma = true;
          this.blank!.percentBlank = 30;
        }
      } else {
        const d = this.rolledComponent!.collections[index!].d!;
        if (d! < 150) {
          this.blank!.percentBlank = 10;
        } else {
          this.blank!.percentBlank = 15;
        }
      }
    }

  }

  addBlank() {
    if (this.blank!.typeBlank === 3) {
      if (this.blank!.specificUnitsBlank === 2 && this.blank!.unitsBlank === 2) {
        if (!this.blank!.len || this.blank!.len < 0) {
          alert("Введите L");
          return;
        }
      } else if (this.blank!.specificUnitsBlank === 2 && this.blank!.unitsBlank === 1) {
        if (!this.blank!.len || this.blank!.len < 0 || !this.blank!.h || this.blank!.h < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.blank!.specificUnitsBlank === 0) {
        if (!this.blank!.percentBlank || this.blank!.percentBlank < 0 || !this.m || this.m < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.blank!.specificUnitsBlank === 1) {
        if (!this.blank!.percentBlank || this.blank!.percentBlank < 0 || !this.s || this.s < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else {
        if (!this.blank!.valueBlank || this.blank!.valueBlank < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
    } else if (this.blank!.typeBlank === 1) {
      if (this.blank!.uselength === 1) {
        if (!this.blank!.len || this.blank!.len <= 0) {
          alert('Введите размер "L" !');
          return;
        }

      } else {
        if (!this.blank!.dw || this.blank!.dw <= 0) {
          alert('Введите размер детали D/B!');
          return;
        }
        if (this.blank!.h && this.blank!.dw <= 0) {
          alert('Размер Н должен быть больше нуля!');
          return;
        }
        if (!this.blank!.h) {
          if (confirm('Ввести размер "Н" ?') === true) {
            return;
          }
        }
        this.blank!.plasma = (document.getElementById('plasma') as HTMLInputElement).checked;
      }

      if (!this.blank!.percentBlank || this.blank!.percentBlank <= 0) {
        alert('Введите припуск!');
        return;
      }
    }
    if (!this.btnEditBlank) {
      this.deleteBlank();
    }
    this.saveBlank();
    this.tempBlank = undefined;
    this.btnEditBlank = false;
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }


  editBlank() {
    this.btnEditBlank = true;
    let idModal: string;
    if (this.blank!.typeBlank === 1) {
      idModal = '#rolled-modal';
    } else {
      idModal = '#material-modal';
    }
    const modalElement: HTMLElement = document.querySelector(idModal!)!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  }


  changeMethodRolled() {
    this.blank!.specificUnitsBlank = +(document.getElementById('selectCalculationBlank') as HTMLInputElement).value;
    this.calculateBlank(this.radioMaterial);
  }


  closeModalRolled() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
    if (this.blank!.id) {
      this.blank = this.tempBlank;
      this.tempBlank = undefined;
      this.btnEditBlank = false;
    } else {
      this.blank = undefined;
    }

  }


  /* Материалы  */

  tblMaterialsClick() {
    if (!this.materialNavigator) {
      this.materialNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
    }
    this.materialFocus();
  }

  materialFocus() {
    this.materialNavigator!.focusedTable = document.querySelector('#tblDrawingMaterials') as HTMLTableElement;
    if (this.spNavigator) {
      this.spNavigator.focusedTable = document.querySelector('#tblDrawingMaterials') as HTMLTableElement;
    }
  }


  spFocus() {
    this.spNavigator!.focusedTable = document.querySelector('#tblSpecification') as HTMLTableElement;
    if (this.materialNavigator) {
      this.materialNavigator.focusedTable = document.querySelector('#tblSpecification') as HTMLTableElement;
    }
  }

  async editMaterial() {
    try {
      if (this.materials.length > 0) {
        if (!this.materialNavigator) {
          this.materialNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
        }
        const index = this.materialNavigator!.findCheckedRowNumber();
        if (index === null) {
          return;
        }
        this.btnEditMaterial = true;
        this.material.name_material = this.materials[index].name_material;
        this.material.idItem = this.materials[index].idItem!;
        this.material.specific_units = this.materials[index].specific_units!;
        this.material.unitsMaterial = this.materials[index].unitsMaterial!;
        this.material.percent = this.materials[index].percent!;
        (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.material.specific_units);
        const modalElement: HTMLElement = document.querySelector('#material-modal')!;
        const modalOptions: ModalOptions = {
          closable: true,
          backdrop: 'static',
        };
        const modal = new Modal(modalElement, modalOptions)
        modal.show();
      }
    } catch (error) {
      alert(error);
    }
  }


  async btnMaterialClick() {
    try {
      if (this.isDrawingInfo) {
        if (this.materials.length > 0) {
          if (!this.materialNavigator) {
            this.materialNavigator = new TableNavigator((document.querySelector('#tblDrawingMaterials') as HTMLTableElement), 0);
          }
          const index = this.materialNavigator!.findCheckedRowNumber();
          if (index !== null && confirm('Удалить выбранный материал?') === true) {
            const data: any = await this.appService.query('delete', `http://localhost:3000/drawings/deleteMaterial/${this.materials[index].id}`);
            if (data?.response === 'ok') {
              alert("Материал удален!");
              this.materials.splice(index, 1);
            } else {
              alert("Материал удален!");
            }
          }
        }
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
    } catch (error) {
      alert(error)
    }

  }


  selectMaterial(index: number) {
    this.material.name_material = this.otherComponent?.collections[index].name_item!;
    this.material.idItem = this.otherComponent?.collections[index].id_item;
    this.material.specific_units = this.otherComponent?.collections[index].specific_units!;
    this.material.unitsMaterial = this.otherComponent?.collections[index].units!;
    this.material.percent = this.otherComponent?.collections[index].percent!;
    (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.material.specific_units);
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
    switch (this.material.specific_units) {
      case 0:
        this.material.valueMaterial = this.material.percent! * this.m!;
        return;
      case 1:
        this.material.valueMaterial = this.material.percent! * this.s!;
        return;
      case 2:
        if (this.material.unitsMaterial === 1) {
          this.blank!.valueBlank = (this.blank!.h! * this.blank!.len!) / 1000000;
        }
        this.material.valueMaterial = +this.material.percent! + +this.blank!.len!;
        return;
    }
  }

  async addMaterail() {
    try {
      if (this.material.specific_units === 2 && this.material.unitsMaterial === 2) {
        if (!this.material.lenMaterial || this.material.lenMaterial < 0) {
          alert("Введите L");
          return;
        }
      } else if (this.material.specific_units === 2 && this.material.unitsMaterial === 1) {
        if (!this.material.lenMaterial || this.material.lenMaterial < 0 || !this.material.hMaterial || this.material.hMaterial < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.material.specific_units === 0) {
        if (!this.material.percent || this.material.percent < 0 || !this.m || this.m < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.material.specific_units === 1) {
        if (!this.material.percent || this.material.percent < 0 || !this.s || this.s < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else {
        if (!this.material.valueMaterial || this.material.valueMaterial < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      let id = null;
      //const idDrawing = this.idDrawing;
      const percentMaterial = this.material.specific_units === 2 ? null : this.material.percent || null;
      const valueMaterial = this.material.unitsMaterial === 2 ? null : +(document.getElementById('amountMaterial') as HTMLInputElement).value;
      const data: any = await this.appService.query('post', `http://localhost:3000/drawings/addMaterial`, [this.material.id || null, this.idDrawing, this.material.idItem, percentMaterial, valueMaterial, this.material.specific_units, this.material.lenMaterial || null, this.material.hMaterial || null])
      if (data.id) {
        this.material.id = data.id;
        this.materials.push(this.material);
        this.closeModalMaterial();
        alert("Материал добавлен!");
      } else if (data.response) {
        alert("Данные обновлены!");
      } else {
        alert("Что-то пошло не так...");
        return;
      }

    } catch (error) {
      alert(error)
    }
  }

  closeModalMaterial() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormmaterial') as HTMLFormElement).dispatchEvent(keyboardEvent);
    if (this.addBlankNotMaterial) {
      if (this.blank) {
        //this.getDrawingInfoFull(this.idDrawing!, 'id');
        this.blank = this.tempBlank;
        this.tempBlank = undefined;
        this.btnEditBlank = false;
      } else {
        this.blank = undefined;
      }
    } else {
      this.btnEditMaterial = false;
    }
  }

  specificUnitsChange() {
    if (this.addBlankNotMaterial === true) {
      this.blank!.specificUnitsBlank = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateBlank(this.radioMaterial,);
    } else {
      this.material.specific_units = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateMaterial();
    }

  }


  /* Спецификация  */
  btnSpecificationClick() {
    if (!this.isDrawingInfo) {
      switch (this.radioMaterial) {
        case 1:
          //this.spComponent!.addSpesification!.type_position = 1;
          this.selectToSpecification(this.rolledComponent, 1, '#modalSP');
          break;
        case 2:
          // this.spComponent!.addSpesification!.type_position = 2;
          this.selectToSpecification(this.hardwareComponent, 2, '#modalSP');
          break;
        case 3:
          // this.spComponent!.addSpesification!.type_position = 3;
          this.selectToSpecification(this.otherComponent, 3, '#material-modalSP');
          break;
        case 4:
          //this.spComponent!.addSpesification!.type_position = 4;
          this.selectToSpecification(this.purchasedComponent, 4, '#modalSP');
          break;
        case 5:
          // this.spComponent!.addSpesification!.type_position = 5;
          this.selectToSpecification(this.viewDrawingsComponent, 5, '#modalSP');
          break;
      }
    } else {
      if (this.specificatios.length === 0) {
        return
      }
      if (!this.spNavigator) {
        this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
      }

      const index = this.spNavigator!.findCheckedRowNumber();
      if (index === null) {
        return;
      }
      if (confirm('Удалить выбранную позицию?') === true) {
        this.deletePositionSP(index);
      }

    }
  }


  selectToSpecification(materialComponent: any, typePosition: number, idModal?: string,) {
    this.addSpesification!.type_position = typePosition;
    const index = materialComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }

    this.addSpesification!.quantity = 1;

    if (typePosition === 5) {
      const id= materialComponent.collections[index!].idItem
      if (this.idDrawing===id) {
        alert("Нельзя добавлять чертеж сам в себя!");
        return;
      }
      this.addSpesification!.idItem = id;
      this.addSpesification!.nameDrawing = materialComponent.collections[index!].nameDrawing;
      this.addSpesification!.numberDrawing = materialComponent.collections[index!].numberDrawing;
      this.addSpesification!.value = materialComponent.collections[index!].value;
      this.addSpesification!.name_item = materialComponent.collections[index!].name_item;
      this.addSpesification!.len = materialComponent.collections[index!].len;
      this.addSpesification!.dw = materialComponent.collections[index!].dw;
      this.addSpesification!.h = materialComponent.collections[index!].h;
      this.addSpesification!.uselength = materialComponent.collections[index!].uselength;
      this.addSpesification!.specific_units = materialComponent.collections[index!].specific_units! || null;
      this.addSpesification!.units = materialComponent.collections[index!].units || null;
      this.addSpesification!.percent = materialComponent.collections[index!].percent! || null;

    } else {
      this.addSpesification!.idItem = materialComponent.collections[index!].id_item;
      this.addSpesification!.name_item = materialComponent.collections[index!].name_item!;
      // this.addSpesification!.id_item = materialComponent.collections[index!].id_item;
      this.addSpesification!.numberDrawing = 'б/ч';
    }
    if (typePosition !== 3) {
      this.addSpesification!.weight = materialComponent.collections[index!].weight;
      if (typePosition === 1) {
        this.addSpesification!.uselength = materialComponent.collections[index!].uselength;
        if (this.addSpesification!.uselength === 0) {
          const t = materialComponent.collections[index!].t;
          if (t! < 9) {
            this.addSpesification!.plasma = false;
          } else {
            this.addSpesification!.plasma = true;
          }
        }
      }
    } else {
      this.addSpesification!.specific_units = materialComponent.collections[index!].specific_units!;
      this.addSpesification!.units = materialComponent.collections[index!].units!;
      this.addSpesification!.percent = materialComponent.collections[index!].percent!;
      (document.getElementById('selectCalculationSP') as HTMLSelectElement).value = String(this.addSpesification!.specific_units);
    }
    const modalElement: HTMLElement = document.querySelector(idModal!)!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();

  }


  async addPositionSP() {
    try {
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
        if (this.addSpesification!.uselength === 1) {
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

      let dataDetails: any[] = [];
      const dataSP: any[] = [this.addSpesification.idParent || null, this.isDrawingInfo ? this.selectedPositionSP : this.selectedPositionSP ? this.selectedPositionSP! + 1 : this.specificatios.length, this.idDrawing, this.addSpesification.type_position, this.addSpesification.quantity];
      switch (+this.addSpesification.type_position!) {
        case 1:
          this.addSpesification.plasma = this.addSpesification?.uselength === 0 ? this.addSpesification.plasma : null;
          dataDetails.push(this.addSpesification.idChild || null, this.addSpesification.idItem, this.addSpesification.len || null, this.addSpesification.dw || null, this.addSpesification.h || null, this.addSpesification.plasma || null, this.addSpesification.nameDrawing, this.addSpesification.idParent || null);
          break;
        case 2:
          dataDetails.push(this.addSpesification.idChild || null, this.addSpesification.idItem, this.addSpesification.nameDrawing, this.addSpesification.idParent || null);
          break;
        case 4:
          dataDetails.push(this.addSpesification.idChild || null, this.addSpesification.idItem, this.addSpesification.nameDrawing, this.addSpesification.idParent || null);
          break;
        case 5:
          dataDetails.push(this.addSpesification.idChild || null, this.addSpesification.idItem, this.addSpesification.idParent || null);
          break;
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/addPositionSP`, { dataSP: dataSP, dataDetails: dataDetails });
      if (this.isDrawingInfo) {
        if (data.response) {
          this.specificatios.splice(this.selectedPositionSP!, 1, Object.assign(new Object(), this.addSpesification));
          alert("Данные сохранены!");
        }
      } else {
        this.addSpesification!.idParent = data.idParent;
        this.addSpesification!.idChild = data.idChild;
        if (this.selectedPositionSP === undefined) {
          this.specificatios.push(Object.assign(new Object(), this.addSpesification));
        } else {
          this.specificatios.splice(this.selectedPositionSP + 1, 0, Object.assign(new Object(), this.addSpesification));
        }
        alert("Позиция добавлена.");

        if (this.selectedPositionSP) {
          this.selectedPositionSP++;
        }
      }
      this.closeModalSP();
    } catch (error) {
      alert(error);
    }
  }


  async addMaterailSP() {
    try {
      if (!this.addSpesification?.quantity || this.addSpesification.quantity <= 0) {
        alert('Введите количество позиций!');
        return;
      }
      if (this.addSpesification!.specific_units === 2 && this.addSpesification!.units === 2) {
        if (!this.addSpesification!.len || this.addSpesification!.len < 0) {
          alert("Введите L");
          return;
        }
      } else if (this.addSpesification!.specific_units === 2 && this.addSpesification!.units === 1) {
        if (!this.addSpesification!.len || this.addSpesification!.len < 0 || !this.addSpesification!.h || this.addSpesification!.h < 0) {
          alert('Введите размеры L, h!');
          return;
        }
      }
      else if (this.addSpesification!.specific_units === 0) {
        if (!this.addSpesification!.percent || this.addSpesification!.percent < 0 || !this.m || this.m < 0) {
          alert('Введите коэффициент, массу!');
          return;
        }
      }
      else if (this.addSpesification!.specific_units === 1) {
        if (!this.addSpesification!.percent || this.addSpesification!.percent < 0 || !this.s || this.s < 0) {
          alert('Введите коэффициент, S!');
          return;
        }
      }
      else {
        if (!this.addSpesification!.value || this.addSpesification!.value < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      const dataSP: any[] = [this.addSpesification.idParent || null, this.isDrawingInfo ? this.selectedPositionSP : this.selectedPositionSP ? this.selectedPositionSP! + 1 : this.specificatios.length, this.idDrawing, this.addSpesification.type_position, this.addSpesification.quantity];
      let dataDetails: any[] = [];
      const percentMaterial = this.addSpesification!.specific_units === 2 ? null : this.addSpesification!.percent || null;
      const value = this.addSpesification!.specific_units === 2 && this.addSpesification!.units === 2 ? this.addSpesification!.len! / 1000 : +(document.getElementById('amountMaterialSP') as HTMLInputElement).value
      // (id_spmaterial, id_item, percent, value, specific_units, L, h, name, id
      dataDetails.push(this.addSpesification.idChild || null, this.addSpesification.idItem, percentMaterial, value, this.addSpesification!.specific_units, this.addSpesification!.len || null, this.addSpesification!.h || null, this.addSpesification.nameDrawing, this.addSpesification.idParent || null);
      const data = await this.appService.query('post', `http://localhost:3000/drawings/addPositionSP`, { dataSP: dataSP, dataDetails: dataDetails });
      if (this.isDrawingInfo) {
        if (data.response === 'ok') {
          this.calculateMaterialSP();
          this.specificatios.splice(this.selectedPositionSP!, 1, Object.assign(new Object(), this.addSpesification));
          alert("Данные сохранены.");
        } else {
          alert("Что то пошло не так.");
        }
      } else {
        this.addSpesification.numberDrawing = 'б/ч';
        this.addSpesification!.idParent = data.idParent;
        this.addSpesification!.idChild = data.idChild;
        this.calculateMaterialSP();
        if (this.selectedPositionSP === undefined) {
          this.specificatios.push(Object.assign(new Object(), this.addSpesification));
        } else {
          this.specificatios.splice(this.selectedPositionSP + 1, 0, Object.assign(new Object(), this.addSpesification));
        }
        alert("Позиция добавлена.");
        if (this.selectedPositionSP) {
          this.selectedPositionSP++;
        }
      }

      this.closeModalMaterialSP();
    } catch (error) {
      alert(error);
    }
  }


  clearAddPositionSP() {
    this.addSpesification!.len = undefined;
    this.addSpesification!.dw = undefined;
    this.addSpesification!.h = undefined;
    this.addSpesification!.nameDrawing = undefined;
    this.addSpesification!.name_item = undefined;
    this.addSpesification!.numberDrawing = undefined;
    this.addSpesification!.weight = undefined;
    this.addSpesification!.specific_units = undefined;
    this.addSpesification!.units = undefined;
    this.addSpesification!.percent = undefined;
    this.addSpesification!.value = undefined;
    this.addSpesification!.idParent = undefined;
    this.addSpesification!.idChild = undefined;
  }


  closeModalSP() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modalFormSP') as HTMLFormElement).dispatchEvent(keyboardEvent);
    this.clearAddPositionSP();
  }


  closeModalMaterialSP() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormMatSP') as HTMLFormElement).dispatchEvent(keyboardEvent);
    this.clearAddPositionSP();
  }


  calculateMaterialSP() {
    switch (this.addSpesification!.specific_units) {
      case 0:
        this.addSpesification!.value = this.addSpesification!.percent! * this.m!;
        return;
      case 1:
        this.addSpesification!.value = this.addSpesification!.percent! * this.s!;
        return;
      case 2:
        if (this.addSpesification!.units === 1) {

          this.addSpesification!.value = (this.addSpesification!.h! * this.addSpesification!.len!) / 1000000;
        }
        // this.addSpesification!.value = +this.addSpesification!.percent! + +this.addSpesification!.len!;
        return;
    }

  }


  editTableSpesification() {
    this.checkSelectedPositionSP();
    if (this.selectedPositionSP === undefined) {
      return
    }
    this.addSpesification = Object.assign({}, this.specificatios[this.selectedPositionSP]);
    let idModal = '';
    if (this.addSpesification.type_position === 3) {
      idModal = '#material-modalSP';
    } else {
      idModal = '#modalSP';
    }
    console.log(this.specificatios)
    const modalElement: HTMLElement = document.querySelector(idModal!)!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  }


  async deletePositionSP(index: number) {
    try {
      const data = await this.appService.query('delete', `http://localhost:3000/drawings/deletePositionSP/${this.idDrawing}/${this.specificatios[index].idParent}/${index}`);
      if (data.response === 'ok') {
        alert('Позиция удалена!');
        this.specificatios.splice(index, 1);
        let i = 0;
        if (this.specificatios.length === 0) {
          this.spNavigator = undefined;
          return;
        }
        /*  for (const item of this.specificatios) {
           item.ind = i;
         } */
      } else {
        alert('Что то пошло не так!');
        return;
      }


    } catch (error) {
      alert(error);
    }
  }


  tblSpesificationClick() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    this.spFocus();
  }


  specificUnitsChangeSP() {
    this.addSpesification!.specific_units = +(document.getElementById('selectCalculationSP') as HTMLInputElement).value;
    this.calculateMaterialSP();
  }


  moveUnit(isMoveUp: boolean) {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    this.spFocus();
    let i = +this.spNavigator.findCheckedRowNumber()!;
    if (i !== null) {
      const unit = this.specificatios[i!];

      if (isMoveUp && i! > 0) {
        this.changeIndex(this.specificatios[i].idParent!, +i - 1, this.specificatios[i - 1].idParent!, i);
        this.specificatios[i!] = this.specificatios[i! - 1];
        this.specificatios[i! - 1] = unit;
      } else if (!isMoveUp && i! < this.specificatios.length - 1) {
        this.changeIndex(this.specificatios[i].idParent!, +i + 1, this.specificatios[i + 1].idParent!, i);
        this.specificatios[i!] = this.specificatios[i! + 1];
        this.specificatios[i! + 1] = unit;
      }
      this.changedData = true;
    }
  }

  async changeIndex(id1: number, ind1: number, id2: number, ind2: number) {
    try {
      const data = await this.appService.query('put', `http://localhost:3000/drawings/changeIndPositionSP/${id1}/${ind1}/${id2}/${ind2}`);
      if (data.response === 'ok') {
        alert('Готово!');

      } else {
        alert('Что то пошло не так!');
        return;
      }
    } catch (error) {
      alert(error);
    }
  }


  btnAddDataDrawings() {
    if (this.isDrawingInfo) {
      this.checkSelectedPositionSP();
      this.spNavigator = undefined;
      this.isDrawingInfo = false;
    }
  }


  checkSelectedPositionSP() {
    if (this.specificatios.length === 0) {
      this.selectedPositionSP = undefined;
      return;
    }

    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);

    }
    let i = this.spNavigator.findCheckedRowNumber()!;
    if (i === null) {
      this.selectedPositionSP = undefined;
    } else {
      this.selectedPositionSP = i;
    }
  }


}
