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
  value: number;
  units: number;

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
  isRolled: boolean = true;
  isHardware: boolean = false;
  isMaterial: boolean = false;
  isPurshaced: boolean = false;

  @ViewChild(OthersComponent, { static: false })
  otherComponent: OthersComponent | undefined;
  @ViewChild(RolledComponent, { static: false })
  rolledComponent: RolledComponent | undefined;
  @ViewChild(HardwareComponent, { static: false })
  hardwareComponent: HardwareComponent | undefined;
  @ViewChild(PurchasedComponent, { static: false })
  purchasedComponent: PurchasedComponent | undefined;

  materials: IaddMaterial[] = []; //материалы для данного чертежа
  tblNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа
  //typeBlank: number | undefined;
  //idBlank: number | undefined;
  nameMaterial: string | undefined;
  idMaterial: number | undefined;
  len: number | undefined;
  dw: number | undefined;
  h: number | undefined;
  s: number | undefined;
  m: number | undefined;
  nameBlank: string = '';
  percent!: number | null;
  value!: number | null;
  specific_units!: number | null;
  units!: number;

  showModal() {
    switch (true) {
      case this.isRolled:
        break;
      case this.isHardware:
        break;
      case this.isMaterial:
        const index = this.otherComponent!.tblNavigator?.findCheckedRowNumber();
        if (index == null) {
          return;
        }
        this.nameMaterial = this.otherComponent?.materials[index].name_material!;
        this.specific_units = this.otherComponent?.materials[index].specific_units!;
        this.percent = this.otherComponent?.materials[index].percent!;
        this.idMaterial = this.otherComponent?.materials[index].idmaterial;
        (document.getElementById('selectCalculation') as HTMLSelectElement).value = String(this.specific_units);
        this.units = this.otherComponent?.materials[index].units!;
        this.calculate();
        const modalElement: HTMLElement = document.querySelector('#crud-modal')!;
        const modalOptions: ModalOptions = {
          closable: true,
          backdrop: 'static',
        };
        const modal = new Modal(modalElement, modalOptions)
        modal.show();
        break;

      case this.isPurshaced:
        break;
    }
  }

  addMaterail() {
    this.materials.push({
      id: this.idMaterial!,
      name_material: this.nameMaterial!,
      specific_units: this.specific_units!,
      x1: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      x2: this.otherComponent?.materials[this.otherComponent!.tblNavigator?.findCheckedRowNumber()!].x1 || null,
      percent: this.percent || null,
      value: this.value!,
      units: this.units
    })
    this.closeModal();
  }

  closeModal() {
    var keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    (document.querySelector('#modal2') as HTMLFormElement).dispatchEvent(keyboardEvent);
  }


  calculate() {
    switch (this.specific_units) {
      case 0:
        this.value = this.percent! * this.m!;
        break;
      case 1:
        this.value = this.percent! * this.s!;
        break;
      case 2:
        this.value = +this.percent! + +this.len!;
        break;
    }
  }

  changeSpecific() {
    this.specific_units = +(document.getElementById('selectCalculation') as HTMLInputElement).value;
    this.calculate();
  }

  radioRolledComponent() {
    this.isRolled = true;
    this.isHardware = false;
    this.isMaterial = false;
    this.isPurshaced = false;
  }

  radioHardwareComponent() {
    this.isRolled = false;
    this.isHardware = true;
    this.isMaterial = false;
    this.isPurshaced = false;
  }

  radioMaterialComponent() {
    this.isRolled = false;
    this.isHardware = false;
    this.isMaterial = true;
    this.isPurshaced = false;
  }

  radioPurshacedComponent() {
    this.isRolled = false;
    this.isHardware = false;
    this.isMaterial = false
    this.isPurshaced = true;
  }



  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('drawing-search')!.dispatchEvent(event);
    this.tblNavigator = new TableNavigator(document.getElementById('tblDrawingMaterials') as HTMLTableElement);
  }
}
