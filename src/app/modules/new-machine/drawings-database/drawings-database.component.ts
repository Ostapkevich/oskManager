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
import { Ispecification, IaddMaterial } from '../../views/drawingSP/interfaceDrawingSP';

//import { DrawingService} from './drawing.service';
//import { DrawingSpService } from '../../views/drawingSP/drawingSp.service';



@Component({
  imports: [FormsModule, CommonModule, RolledComponent, HardwareComponent, OthersComponent, PurchasedComponent, ViewDrawingsComponent],
  standalone: true,
  providers: [],
  selector: 'app-drawings-database',
  templateUrl: './drawings-database.component.html',
  styleUrls: ['./drawings-database.component.css']
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
  oldTypeBlank: number | undefined;



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
  //isp!: number | null;
  savePath: string[] = []; // Выбор пути в select для сохранения
  s: number | undefined;//Масса чертежа
  m: number | undefined;
  len: number | undefined; // L чертежа
  dw: number | undefined; // D(B) чертежа
  h: number | undefined;//H чертежа
  drawingNamber = '';
  drawingName = '';
  filePath: string[] = []; // массив путей где будут хранится чертежи

  /* Заготовка */
  id: number | undefined; // id  - уникальный ключ в таблице заготовки чертежа в базе данных
  idBlank: number | undefined; // id добавленной заготовки
  nameBlank: string = ''; // имя добавленной заготовки
  typeBlank: number | undefined;
  blankWeight: number | undefined;
  useLenth: number | undefined;
  plasma: boolean = true

  addBlankNotMaterial: boolean | undefined;
  percentBlank!: number | undefined;//коэф для заготовки
  valueBlank: number | undefined;

  specificUnitsBlank!: number | undefined;
  unitsBlank!: number | undefined;


  /* Материал */
  materialNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  nameMaterial: string | undefined; // имя добавленного материалы для чертежа
  idMaterial: number | undefined; // id добавленного материалы для чертежа
  materials: IaddMaterial[] = []; //материалы для данного чертежа

  lenMaterial: number | undefined;
  dwMaterial: number | undefined;
  hMaterial: number | undefined;

  valueMaterial!: number | undefined;
  percentMaterial!: number | undefined;//коэф для материалов

  specificUnitsMaterial!: number | undefined;
  unitsMaterial!: number | undefined;
  /* Сп */
  specificatios: Partial<Ispecification>[] = [];
  spNavigator: TableNavigator | undefined;
  addSpesification: Partial<Ispecification> | undefined = {};
  selectedPositionSP: number | undefined;

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


  ngOnInit(): void {
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
        if (this.specificUnitsBlank === 1 && (!this.s || this.s <= 0)) {
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
      drawing.push(this.idBlank === undefined ? null : this.typeBlank);
      drawing.push(Boolean(this.materials.length > 0));
      drawing.push(this.s || null);
      drawing.push(JSON.stringify(this.filePath));
      drawing.push(Boolean(this.specificatios.length > 0));
      let blank: any[] = [];
      switch (this.typeBlank) {
        case 1:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          blank.push(this.percentBlank);
          blank.push(this.useLenth ? null : this.plasma);
          blank.push(this.len || null, this.dw || null, this.h || null);
          break;
        case 2:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          break;
        case 3:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
          blank.push(this.specificUnitsBlank === 3 ? null : this.percentBlank);
          blank.push(this.specificUnitsBlank === 3 ? this.valueBlank : null);
          blank.push(this.specificUnitsBlank);
          blank.push(this.len || null, this.h || null)
          break;
        case 4:
          blank.push(this.id || null);
          blank.push(this.idDrawing || null);
          blank.push(this.idBlank);
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
      this.showSaveModal();
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
      switch (this.typeBlank) {
        case 1:
          blank.push(this.id || null);
          blank.push(this.idDrawing);
          blank.push(this.idBlank);
          blank.push(this.useLenth === 1 ? this.len : null);
          blank.push(this.useLenth === 1 ? null : this.dw);
          blank.push(this.useLenth === 1 ? null : this.h);
          blank.push(this.plasma);
          blank.push(this.percentBlank);
          this.len = this.useLenth === 1 ? this.len : undefined;
          this.dw = this.useLenth === 1 ? undefined : this.dw;
          this.h = this.useLenth === 1 ? undefined : this.h;
          break;
        case 2:
          blank.push(this.id || null);
          blank.push(this.idDrawing);
          blank.push(this.idBlank);
          break;
        case 3:
          blank.push(this.id || null);
          blank.push(this.idDrawing);
          blank.push(this.idBlank);
          blank.push(this.specificUnitsBlank === 3 ? null : this.percentBlank);
          blank.push(this.specificUnitsBlank === 3 ? this.valueBlank : null);
          blank.push(this.specificUnitsBlank);
          blank.push(this.len || null, this.h || null)
          break;
        case 4:
          blank.push(this.id || null);
          blank.push(this.idDrawing);
          blank.push(this.idBlank);
          break;
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/saveBlank/${this.typeBlank}`, blank);
      if (data.id) {
        this.id = data.id;
        alert('Данные сохранены!');
      } else {
        alert("Что-то пошло не так... Данные не сохранены!");
      }
    } catch (error) {
      alert(error);
    }
  }

  showSaveModal() {
    const modalElement: HTMLElement = document.querySelector('#saveModal')!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  }

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
      this.typeBlank = drawingInfo.type_blank;
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

  showBlankInfo(blankInfo: any) {
    if (blankInfo) {
      this.id = blankInfo.id;
      this.idBlank = blankInfo.id_item;
      this.blankWeight = blankInfo.weight;
      this.nameBlank = blankInfo.name_item;
      switch (this.typeBlank) {
        case 1:
          this.useLenth = blankInfo.uselength;
          this.len = blankInfo.L;
          this.dw = blankInfo.d_b;
          this.h = blankInfo.h;
          this.plasma = Boolean(blankInfo.plasma);
          this.percentBlank = blankInfo.allowance
          break;
        case 3:
          this.len = blankInfo.L;
          this.h = blankInfo.h;
          this.percentBlank = blankInfo.percent;
          this.valueBlank = blankInfo.value;
          this.specificUnitsBlank = blankInfo.specific_units;
          this.unitsBlank = blankInfo.units;
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
      const tempIdDrawind = (document.getElementById('idDrawing') as HTMLInputElement).value;
      this.clearDrawing();
      this.clearBlank();
      this.clearMaterial();
      if (data.notFound) {
        setTimeout(() => alert('Чертеж не найден!'));
      }
      this.showDrawingInfo(data.drawing)
      this.specificatios.length = 0;
      this.showBlankInfo(data.blank);
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


  clearBlank() {
    this.id = undefined;
    this.idBlank = undefined;
    this.blankWeight = undefined;
    this.nameBlank = "";
    this.useLenth = undefined;
    this.len = undefined;
    this.dw = undefined;
    this.h = undefined;
    //this.plasma = undefined;
    this.percentBlank = undefined;
    this.valueBlank = undefined;
    this.specificUnitsBlank = undefined;
    this.unitsBlank = undefined;
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
      if (this.idBlank && confirm('Удалить заготовку?') === true) {
        this.idBlank = undefined;
      }
      return;
    } else {
      if (this.id) {
        this.oldTypeBlank = this.typeBlank;
      }
      this.addBlankNotMaterial = true;
      let index: number;
      switch (this.radioMaterial) {
        case 1:
          this.typeBlank = 1;
          this.selectBlank(this.rolledComponent!, '#rolled-modal');
          //this.deleteBlank();
          break;
        case 2:
          this.typeBlank = 2;
          this.changedData = true;
          this.selectBlank(this.hardwareComponent!);
          this.deleteBlank();
          this.saveBlank();
          break;
        case 3:
          this.typeBlank = 3;
          this.selectBlank(this.otherComponent!, '#material-modal');
          //this.deleteBlank();
          break;
        case 4:
          this.typeBlank = 4;
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
      if (this.id && this.typeBlank !== this.oldTypeBlank) {
        const data = await this.appService.query('delete', `http://localhost:3000/drawings/deleteBlank/${this.oldTypeBlank}/${this.id}/${this.idDrawing}/${this.typeBlank}`)
        if (data.response !== 'ok') {
          alert('Что-то пошло не так!');

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
    if (this.idBlank && confirm('Чертеж уже содержит заготовку! Заменить заготовку?') === false) {
      return;
    }

    this.nameBlank = materialComponent.collections[index!].name_item!;
    this.idBlank = materialComponent.collections[index!].id_item;
    if (materialComponent !== this.otherComponent) {
      this.blankWeight = materialComponent.collections[index!].weight;
      if (materialComponent === this.hardwareComponent || materialComponent === this.purchasedComponent) {

        return;
      }
      if (materialComponent === this.rolledComponent) {
        this.useLenth = this.rolledComponent!.collections[index!].uselength;
      }
    } else {
      this.specificUnitsBlank = this.otherComponent?.collections[index!].specific_units!;
      this.unitsBlank = this.otherComponent?.collections[index!].units!;
      this.percentBlank = this.otherComponent?.collections[index!].percent!;
      (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specificUnitsBlank);
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
      switch (this.specificUnitsBlank) {
        case 0:
          this.valueBlank = this.percentBlank! * this.m!;
          return;
        case 1:
          this.valueBlank = this.percentBlank! * this.s!;
          return;
        case 2:
          if (this.unitsBlank === 1) {
            this.valueBlank = (this.h! * this.len!) / 1000000;
          }
          return;
      }
    } else if (this.radioMaterial === 1) {
      if (this.useLenth === 0) {
        const t = this.rolledComponent!.collections[index!].t!;
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
          this.plasma = true;
          this.percentBlank = 30;
        }
      } else {
        const d = this.rolledComponent!.collections[index!].d!;
        if (d! < 150) {
          this.percentBlank = 10;
        } else {
          this.percentBlank = 15;
        }
      }
    }

  }

  addBlank() {
    if (this.typeBlank === 3) {
      if (this.specificUnitsBlank === 2 && this.unitsBlank === 2) {
        if (!this.len || this.len < 0) {
          alert("Введите L");
          return;
        }
      } else if (this.specificUnitsBlank === 2 && this.unitsBlank === 1) {
        if (!this.len || this.len < 0 || !this.h || this.h < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.specificUnitsBlank === 0) {
        if (!this.percentBlank || this.percentBlank < 0 || !this.m || this.m < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.specificUnitsBlank === 1) {
        if (!this.percentBlank || this.percentBlank < 0 || !this.s || this.s < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else {
        if (!this.valueBlank || this.valueBlank < 0) {
          alert('Введите количество материала!');
          return;
        }
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
        this.plasma = (document.getElementById('plasma') as HTMLInputElement).checked;
      }

      if (!this.percentBlank || this.percentBlank <= 0) {
        alert('Введите припуск!');
        return;
      }
    }
    this.deleteBlank();
    this.saveBlank();
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }

  changeMethodRolled() {
    this.specificUnitsBlank = +(document.getElementById('selectCalculationBlank') as HTMLInputElement).value;
    this.calculateBlank(this.radioMaterial);
  }


  closeModalRolled() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormBlank') as HTMLFormElement).dispatchEvent(keyboardEvent);
    if (this.id) {
      this.getDrawingInfoFull(this.idDrawing!, 'id');
    } else {
      this.clearBlank();
    }

  }


  /* Материалы  */


  async btnMaterialClick() {
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
  }

  selectMaterial(index: number) {
    this.nameMaterial = this.otherComponent?.collections[index].name_item!;
    this.idMaterial = this.otherComponent?.collections[index].id_item;
    this.specificUnitsMaterial = this.otherComponent?.collections[index].specific_units!;
    this.unitsMaterial = this.otherComponent?.collections[index].units!;
    this.percentMaterial = this.otherComponent?.collections[index].percent!;
    (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specificUnitsMaterial);
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
    switch (this.specificUnitsMaterial) {
      case 0:
        this.valueMaterial = this.percentMaterial! * this.m!;
        return;
      case 1:
        this.valueMaterial = this.percentMaterial! * this.s!;
        return;
      case 2:
        if (this.unitsMaterial === 1) {
          this.valueBlank = (this.h! * this.len!) / 1000000;
        }
        this.valueMaterial = +this.percentMaterial! + +this.len!;
        return;
    }
  }

  async addMaterail() {
    try {
      if (this.specificUnitsMaterial === 2 && this.unitsMaterial === 2) {
        if (!this.lenMaterial || this.lenMaterial < 0) {
          alert("Введите L");
          return;
        }
      } else if (this.specificUnitsMaterial === 2 && this.unitsMaterial === 1) {
        if (!this.lenMaterial || this.lenMaterial < 0 || !this.hMaterial || this.hMaterial < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.specificUnitsMaterial === 0) {
        if (!this.percentMaterial || this.percentMaterial < 0 || !this.m || this.m < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else if (this.specificUnitsMaterial === 1) {
        if (!this.percentMaterial || this.percentMaterial < 0 || !this.s || this.s < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      else {
        if (!this.valueMaterial || this.valueMaterial < 0) {
          alert('Введите количество материала!');
          return;
        }
      }
      let id = null;
      const idDrawing = this.idDrawing;
      const percentMaterial = this.specificUnitsMaterial === 2 ? null : this.percentMaterial || null;
      const valueMaterial = this.unitsMaterial === 2 ? null : +(document.getElementById('amountMaterial') as HTMLInputElement).value;
      const data: any = await this.appService.query('post', `http://localhost:3000/drawings/addMaterial`, [null, this.idDrawing, this.idMaterial, percentMaterial, valueMaterial, this.specificUnitsMaterial, this.lenMaterial || null, this.hMaterial || null])
      if (data.id) {
        id = data.id;
        this.materials.push({
          id: id,
          idDrawing: idDrawing!,
          idItem: this.idMaterial!,
          name_material: this.nameMaterial!,
          unitsMaterial: this.unitsMaterial!,
          percent: percentMaterial,
          valueMaterial: valueMaterial,
          specific_units: this.specificUnitsMaterial!,
          lenMaterial: this.lenMaterial || null,
          //dw: this.dwMaterial || null,
          hMaterial: this.hMaterial || null,
        })
        this.closeModalMaterial();
        alert("Материал добавлен!");
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
      if (this.id) {
        this.getDrawingInfoFull(this.idDrawing!, 'id');
      } else {
        this.clearBlank();
      }
    }
  }


  specificUnitsChange() {
    if (this.addBlankNotMaterial === true) {
      this.specificUnitsBlank = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateBlank(this.radioMaterial,);
    } else {
      this.specificUnitsMaterial = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
      this.calculateMaterial();
    }

  }


  /* Спецификация  */



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
      const dataSP: any[] = [this.specificatios.length, this.idDrawing, this.addSpesification.type_position, this.addSpesification.quantity];
      let dataDetails: any[] = [];
      const percentMaterial = this.addSpesification!.specific_units === 2 ? null : this.addSpesification!.percent || null;
      const value = this.addSpesification!.specific_units === 2 && this.addSpesification!.units === 2 ? this.addSpesification!.len! / 1000 : +(document.getElementById('amountMaterialSP') as HTMLInputElement).value
      // (id_spmaterial, id_item, percent, value, specific_units, L, h, name, id
      dataDetails.push(null, this.addSpesification.idItem, percentMaterial, value, this.addSpesification!.specific_units, this.addSpesification!.len || null, this.addSpesification!.h || null, this.addSpesification.name);
      const data = await this.appService.query('post', `http://localhost:3000/drawings/addPositionSP`, { dataSP: dataSP, dataDetails: dataDetails });

      this.specificatios.push({
        idChild: data.idChild,
        idItem: this.addSpesification!.idItem,
        name_item: this.addSpesification!.name_item,
        units: this.addSpesification!.units!,
        percent: percentMaterial,
        value: value,
        specific_units: this.addSpesification!.specific_units,
        len: this.addSpesification!.len || null,
        h: this.addSpesification!.h || null,
        quantity: this.addSpesification?.quantity,
        type_position: this.addSpesification?.type_position,
        name: this.addSpesification.name,
        idParent: data.idParent,
        number_item: 'б/ч'
      })

      this.closeModalMaterialSP();

      alert('Позиция добавлена.');
      if (!this.spNavigator) {
        this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
      }
    } catch (error) {
      alert(error);
    }
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
        this.addSpesification!.value = +this.addSpesification!.percent! + +this.addSpesification!.len!;
        return;
    }

  }

  /* selectToSpecification(materialComponent: any, idModal?: string) {
    const index = materialComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    const addSpesification: Partial<Ispecification> = {}
    addSpesification!.quantity = 1;
    addSpesification!.idItem = materialComponent.collections[index!].id_item;
    if (materialComponent === this.viewDrawingsComponent) {
      addSpesification!.name = materialComponent.collections[index!].name_item!;
      addSpesification!.number_item = this.viewDrawingsComponent!.collections[index!].number_item;
      addSpesification!.name_item = undefined;
    } else {
      addSpesification!.name_item = materialComponent.collections[index!].name_item!;
      // this.addSpesification!.id_item = materialComponent.collections[index!].id_item;
      addSpesification!.number_item = 'б/ч';
    }
    if (materialComponent !== this.otherComponent) {
      addSpesification!.weight = materialComponent.collections[index!].weight;
      if (materialComponent === this.rolledComponent) {
        addSpesification!.useLenth = this.rolledComponent!.collections[index!].uselength;
        if (addSpesification!.useLenth === 0) {
          const t = this.rolledComponent!.collections[index!].t;
          if (t! < 9) {
            addSpesification!.plasma = false;
          } else {
            addSpesification!.plasma = true;
          }
        }
      }
    } else {
      addSpesification!.specific_units = this.otherComponent?.collections[index!].specific_units!;
      addSpesification!.units = this.otherComponent?.collections[index!].units!;
      addSpesification!.percent = this.otherComponent?.collections[index!].percent!;
      (document.getElementById('selectCalculationSP') as HTMLSelectElement).value = String(this.spComponent!.addSpesification!.specific_units);
    }
  
    const modalElement: HTMLElement = document.querySelector(idModal!)!;
    const modalOptions: ModalOptions = {
      closable: true,
      backdrop: 'static',
    };
    const modal = new Modal(modalElement, modalOptions);
    modal.show();
  } */

  editSp() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    const index = this.spNavigator!.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    this.selectedPositionSP=index;
    this.addSpesification = Object.assign({}, this.specificatios[index]);
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

  spClick() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
  }

  selectToSpecification(materialComponent: any, typePosition: number, idModal?: string,) {
    this.addSpesification!.type_position = typePosition;
    const index = materialComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }

    this.addSpesification!.quantity = 1;
    this.addSpesification!.idItem = materialComponent.collections[index!].id_item;
    if (typePosition === 5) {
      this.addSpesification!.name = materialComponent.collections[index!].name_item!;
      this.addSpesification!.number_item = materialComponent.collections[index!].number_item;
      this.addSpesification!.name_item = undefined;
    } else {
      this.addSpesification!.name_item = materialComponent.collections[index!].name_item!;
      // this.addSpesification!.id_item = materialComponent.collections[index!].id_item;
      this.addSpesification!.number_item = 'б/ч';
    }
    if (typePosition !== 3) {
      this.addSpesification!.weight = materialComponent.collections[index!].weight;
      if (typePosition === 1) {
        this.addSpesification!.useLenth = materialComponent.collections[index!].uselength;
        if (this.addSpesification!.useLenth === 0) {
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
      const dataSP: any[] = [this.addSpesification.idParent || null, this.addSpesification.idParent===null? this.selectedPositionSP===undefined?this.specificatios.length:this.selectedPositionSP+1:this.selectedPositionSP, this.idDrawing, this.addSpesification.type_position, this.addSpesification.quantity];
      let dataDetails: any[] = [];
      switch (+this.addSpesification.type_position!) {
        case 1:
          this.addSpesification.plasma = this.addSpesification?.useLenth === 0 ? (document.getElementById('plasmaPos') as HTMLInputElement).checked : null;
          dataDetails.push(this.addSpesification.idChild||null , this.addSpesification.idItem, this.addSpesification.len || null, this.addSpesification.dw || null, this.addSpesification.h || null, this.addSpesification.plasma || null, this.addSpesification.name,this.addSpesification.idParent || null );
          break;
        case 2:
          dataDetails.push(this.addSpesification.idChild||null, this.addSpesification.idItem, this.addSpesification.name,this.addSpesification.idParent || null );
          break;
        case 4:
          dataDetails.push( this.addSpesification.idChild||null, this.addSpesification.idItem, this.addSpesification.name,this.addSpesification.idParent || null);
          break;
        case 5:
          dataDetails.push(this.addSpesification.idChild||null, this.addSpesification.idItem,this.addSpesification.idParent || null );
          break;
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/addPositionSP`, { dataSP: dataSP, dataDetails: dataDetails });
      if (data.response) {
        this.specificatios.splice(this.selectedPositionSP!,1,Object.assign(new Object(), this.addSpesification));
        alert("Данные сохранены!");
      } else {
        this.addSpesification!.idParent = data.idParent;
        this.addSpesification!.idChild = data.idChild;
        if (this.selectedPositionSP===undefined) {
          this.specificatios.push(Object.assign(new Object(), this.addSpesification));
        } else {
          this.specificatios.splice(this.selectedPositionSP+1,0,Object.assign(new Object(), this.addSpesification));
        }
        alert("Позиция добавлена.");
      }
      this.closeModalSP();
    } catch (error) {
      alert(error);
    }
  }


  specificUnitsChangeSP() {
    this.addSpesification!.specific_units = +(document.getElementById('selectCalculationSP') as HTMLInputElement).value;
    this.calculateMaterialSP();
  }


  closeModalSP() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modalFormSP') as HTMLFormElement).dispatchEvent(keyboardEvent);
    this.clearAddPositionSP();
  }


  clearAddPositionSP() {
    this.addSpesification!.len = undefined;
    this.addSpesification!.dw = undefined;
    this.addSpesification!.h = undefined;
    this.addSpesification!.name = undefined;
    this.addSpesification!.name_item = undefined;
    this.addSpesification!.number_item = undefined;
    this.addSpesification!.weight = undefined;
    this.addSpesification!.specific_units = undefined;
    this.addSpesification!.units = undefined;
    this.addSpesification!.percent = undefined;
    this.addSpesification!.value = undefined;

  }


  plasmaSpChange(target: any) {
    console.log(this.specificatios[this.spNavigator!.rowByNumberCellChecked(target, 15)].plasma);
  }


  moveUnit(isMoveUp: boolean) {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    let i = +this.spNavigator.findCheckedRowNumber()!;
    if (i !== null) {
      const unit = this.specificatios[i!];
      console.log(this.specificatios)
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


  async infoSP(idOrNumber: number | string, findBy: 'id' | 'number') {
    try {
      let data: any;
      data = await this.appService.query('get', `http://localhost:3000/drawings/findDrawingInfoFUll/${idOrNumber}/${findBy}`);
      const tempIdDrawind = (document.getElementById('idDrawing') as HTMLInputElement).value;
      this.specificatios.length = 0;
      if (data.positionsSP) {
        this.specificatios = data.positionsSP;
      }
    } catch (error) {
      alert(error);
    }
  }

  addDataSpClick() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    this.isDrawingInfo=false;
    let i = +this.spNavigator.findCheckedRowNumber()!;
    if (i===null) {
      this.selectedPositionSP=undefined;
    } else {
      this.selectedPositionSP=i;
    }
  }

}
