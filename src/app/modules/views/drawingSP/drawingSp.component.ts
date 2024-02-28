import { Component, Input } from '@angular/core';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { Ispecification } from '../../new-machine/drawings-database/interfaceDrawingSP';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/app.service';
import { Modal, ModalOptions } from 'flowbite';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-sp',
  templateUrl: './drawingSP.component.html',
  styleUrls: ['./drawingSP.component.css']
})
export class DrawingsSPComponent {
  constructor(private appService: AppService) { }

  specificatios: Partial<Ispecification>[]=[] ;
  spNavigator: TableNavigator | undefined;
  addSpesification: Partial<Ispecification> | undefined = {};

  @Input() idDrawing: number|undefined;
  @Input() m: number|undefined;
  @Input() s: number|undefined;

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
      /* if (!this.spNavigator) {
        this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
      } */
    } catch (error) {
      alert(error);
    }
  }

 
  selectToSpecification(materialComponent: any, typePosition:number, idModal?: string, ) {
    this.addSpesification!.type_position = typePosition;
    const index = materialComponent!.tblNavigator?.findCheckedRowNumber();
    if (index === null) {
      return;
    }
    const addSpesification: Partial<Ispecification> = {}
    addSpesification!.quantity = 1;
    addSpesification!.idItem = materialComponent.collections[index!].id_item;
    if (typePosition === 5) {
      addSpesification!.name = materialComponent.collections[index!].name_item!;
      addSpesification!.number_item = materialComponent.collections[index!].number_item;
      addSpesification!.name_item = undefined;
    } else {
      addSpesification!.name_item = materialComponent.collections[index!].name_item!;
      // this.addSpesification!.id_item = materialComponent.collections[index!].id_item;
      addSpesification!.number_item = 'б/ч';
    }
    if (typePosition !== 3) {
      addSpesification!.weight = materialComponent.collections[index!].weight;
      if (typePosition === 1) {
        addSpesification!.useLenth = materialComponent.collections[index!].uselength;
        if (addSpesification!.useLenth === 0) {
          const t = materialComponent.collections[index!].t;
          if (t! < 9) {
            addSpesification!.plasma = false;
          } else {
            addSpesification!.plasma = true;
          }
        }
      }
    } else {
      addSpesification!.specific_units = materialComponent.collections[index!].specific_units!;
      addSpesification!.units = materialComponent.collections[index!].units!;
      addSpesification!.percent = materialComponent.collections[index!].percent!;
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


  closeModalMaterialSP() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modaFormMatSP') as HTMLFormElement).dispatchEvent(keyboardEvent);
    this.clearAddPositionSP();
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
      const dataSP: any[] = [this.specificatios.length, this.idDrawing, this.addSpesification.type_position, this.addSpesification.quantity];
      let dataDetails: any[] = [];
      switch (+this.addSpesification.type_position!) {
        case 1:
          this.addSpesification.plasma = this.addSpesification?.useLenth === 0 ? (document.getElementById('plasmaPos') as HTMLInputElement).checked : null;
          dataDetails.push(null, this.addSpesification.idItem, this.addSpesification.len || null, this.addSpesification.dw || null, this.addSpesification.h || null, this.addSpesification.plasma || null, this.addSpesification.name);
          break;
        case 2:
          dataDetails.push(null, this.addSpesification.idItem, this.addSpesification.name);
          break;
        case 4:
          dataDetails.push(null, this.addSpesification.idItem, this.addSpesification.name);
          break;
        case 5:
          dataDetails.push(null, this.addSpesification.idItem);
          break;
      }
      const data = await this.appService.query('post', `http://localhost:3000/drawings/addPositionSP`, { dataSP: dataSP, dataDetails: dataDetails });
      console.log(data)
      this.addSpesification!.idParent = data.idParent;
      this.addSpesification!.idChild = data.idChild;
      this.specificatios.push(Object.assign(new Object(), this.addSpesification));
      this.closeModalSP();
      alert("Позиция добавлена.");

    } catch (error) {
      alert(error);
    }
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


  moveUnit(isMoveUp: boolean) {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    let i = this.spNavigator?.findCheckedRowNumber();
    if (i !== null) {
      const unit = this.specificatios[i!];
      if (isMoveUp && i! > 0) {
        this.specificatios[i!] = this.specificatios[i! - 1];
        this.specificatios[i! - 1] = unit;
      } else if (!isMoveUp && i! < this.specificatios.length - 1) {
        this.specificatios[i!] = this.specificatios[i! + 1];
        this.specificatios[i! + 1] = unit;
      }
      //  this.changedData = true;
    }
  }


  spClick() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
  }

}
