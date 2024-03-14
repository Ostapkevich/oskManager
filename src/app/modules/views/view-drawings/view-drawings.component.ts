import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DrawingsDatabaseComponent } from '../../new-machine/drawings-database/drawings-database.component';
import { Ispecification, IBlank, IMaterial, Idrawings } from '../../new-machine/drawings-database/interfaceDrawingSP';
import { DrawingsDatabaseService } from '../../new-machine/drawings-database/drawings-database.service';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DrawingsDatabaseComponent],
  providers: [],
  selector: 'app-viewDrawings',
  templateUrl: './view-drawings.component.html',
  styleUrls: ['./view-drawings.component.css']
})
export class ViewDrawingsComponent implements OnInit {
  constructor(private appService: AppService, private drawingsDbService: DrawingsDatabaseService) { }

  idDrawing: number | undefined;
  number_item: string = '';
  name_item: string = '';
  min: number | undefined;
  max: number | undefined;
  s: number | undefined;//Масса чертежа
  m: number | undefined;


  collections: Idrawings[] = [];
  page: number = 1;
  tblNavigator: TableNavigator | undefined;

  blank: Partial<IBlank> | undefined;
  materials: Partial<IMaterial>[] = [];
  materialNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа

  specificatios: Partial<Ispecification>[] = [];
  spNavigator: TableNavigator | undefined;

  @Input() showElement = true;
  showDetail = false;


  async onSubmit() {
    try {
      this.collections.length = 0;
      const params = <any>{};
      if (this.idDrawing) {
        params.idDrawing = +this.idDrawing;
      }
      if (this.number_item) {
        params.numberDrawing = `%${this.number_item}%`;
      }
      if (this.name_item) {
        params.nameDrawing = `%${this.name_item}%`;
      }
      if (this.min) {
        params.min = +this.min;
      }
      if (this.max) {
        params.max = +this.max
      }
      if (Object.keys(params).length === 0) {
        return;
      }
      const data = await this.appService.query('get', `http://localhost:3000/viewDrawing/selectDrawings`, params);
      if (data.notFound) {
        setTimeout(() => alert('Чертеж не найден!'));
        return;
      } else {
        this.collections = data.drawings;
      }
    } catch (error) {
      alert(error);
    }
  }

  tblDrawingsClick() {
    if (!this.tblNavigator) {
      this.tblNavigator = new TableNavigator((document.querySelector('#tblDrawings') as HTMLTableElement), 0);
      console.log('eee')
    }
  }

  tblSpesificationClick() {
    if (!this.spNavigator) {
      this.spNavigator = new TableNavigator((document.querySelector('#tblSpecification') as HTMLTableElement), 0);
    }
    this.spFocus();
  }

  spFocus() {
    this.spNavigator!.focusedTable = document.querySelector('#tblSpecification') as HTMLTableElement;
    if (this.materialNavigator) {
      this.materialNavigator.focusedTable = document.querySelector('#tblSpecification') as HTMLTableElement;
    }
  }

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


  async showInfo() {
    try {
      this.showDetail = true;
      const index = this.tblNavigator?.findCheckedRowNumber();
      if (index === null) {
        return;
      }
      console.log(this.collections)
      const id = this.collections[index!].idDrawing;
      this.m=this.collections[index!].weight;
      let data: any;
      data = await this.appService.query('get', `http://localhost:3000/drawings/getDrawingInfoFull/${id}/id`);
      console.log(data)
      this.blank = undefined;
      this.materials.length = 0;
      this.specificatios.length = 0;
      console.log(data.blank)
      if (data.blank) {
        this.blank = this.drawingsDbService.showBlankInfo(data.blank, data.drawing.type_blank);
      }
      if (data.materials) {
        this.drawingsDbService.showMaterialInfo(this.materials, data.materials);
      }
      console.log(data.positionsSP)
      if (data.positionsSP) {
        this.specificatios = data.positionsSP;
      }

    } catch (error) {
      alert(error);
    }

  }


  showDrawing(element: any) { }

  firstPage() { }
  previousPage() { }
  nextPage() { }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('idmaterial')!.dispatchEvent(event);

  }
}
