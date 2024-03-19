import { Component, OnInit, Input, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DrawingsDatabaseComponent } from '../../new-machine/drawings-database/drawings-database.component';
import { Ispecification, IBlank, IMaterial, Idrawings } from '../../new-machine/drawings-database/interfaceDrawingSP';
import { DrawingsDatabaseService } from '../../new-machine/drawings-database/drawings-database.service';

import { NgxImageZoomModule } from 'ngx-image-zoom';
interface IcurrentDrawing {
  s: number,
  m: number,
  id: number,
  numberDrawing: string,
  nameDrawing: string
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DrawingsDatabaseComponent,NgxImageZoomModule],
  providers: [],
  selector: 'app-viewDrawings',
  templateUrl: './view-drawings.component.html',
  styleUrls: ['./view-drawings.component.css']
})
export class ViewDrawingsComponent implements OnInit, DoCheck {
  constructor(private appService: AppService, private drawingsDbService: DrawingsDatabaseService) { }

  idDrawing: number | undefined;
  number_item: string = '';
  name_item: string = '';
  min: number | undefined;
  max: number | undefined;
  currentDrawing: IcurrentDrawing | undefined;


  collections: Idrawings[] = [];
  page: number = 1;
  tblNavigator: TableNavigator | undefined;

  blank: Partial<IBlank> | undefined;
  materials: Partial<IMaterial>[] = [];
  materialNavigator: TableNavigator | undefined; // для таблицы материалов для данного чертежа

  specificatios: Partial<Ispecification>[] = [];
  spNavigator: TableNavigator | undefined;

  @Input() showAllElements = true;
  showDetail = false;

  hasScroll: boolean = false;
  @ViewChild('divSP') divElement!: ElementRef;

  drawingsLinks: Array<IcurrentDrawing> = [];
path='assets/СВ35-501 Удлинитель к борштангше.JPG';

  ngDoCheck(): void {
    if (this.divElement) {
      const element = this.divElement.nativeElement as HTMLDivElement;
      this.hasScroll = element.scrollHeight > element.clientHeight;
    }
  }


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
        this.tblNavigator = undefined;
        this.collections = data.drawings;
        console.log('collections', this.collections)
      }
    } catch (error) {
      alert(error);
    }
  }


  tblDrawingsClick() {

    if (!this.tblNavigator) {
      this.tblNavigator = new TableNavigator((document.querySelector('#tblDrawings') as HTMLTableElement), 0);
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


  async showParentDrawing(targetButton: any) {
    try {

      this.tblDrawingsClick();
      this.showDetail = true;
      const index = this.tblNavigator?.findRowButton(targetButton, 2);
      this.currentDrawing = {
        s: this.collections[index!].s,
        m: this.collections[index!].weight,
        id: this.collections[index!].idDrawing,
        numberDrawing: this.collections[index!].numberDrawing,
        nameDrawing: this.collections[index!].nameDrawing
      };
      await this.getDrawingInfo(this.currentDrawing.id);
      this.drawingsLinks.push(Object.assign({}, this.currentDrawing));
      console.log('this.drawingsLinks parent', this.drawingsLinks)
    } catch (error) {
      alert(error);
    }
  }

  showImageDrawing(targetButton:any){
    this.tblDrawingsClick();
    console.log(this.collections)
    const index = this.tblNavigator?.findRowButton(targetButton, 3);
    console.log(this.collections[index!].path[0])
   // this.path='http://localhost:3000/'+this.collections[index!].path[0].replace(/\\/g, '/');
   
    console.log(this.path)
  }

   async showChildDrawing(numberButton: any) {
    try {
      this.spNavigator = undefined;
      this.tblSpesificationClick();
      const index = this.spNavigator!.findRowButton(numberButton, 3);
      this.currentDrawing = {
        s: this.specificatios[index!].s!,
        m: this.specificatios[index!].weight!,
        id: this.specificatios[index!].idItem!,
        numberDrawing: this.specificatios[index!].numberDrawing!,
        nameDrawing: this.specificatios[index!].nameDrawing!
      };
      
      this.clearInfo();
      await this.getDrawingInfo(this.currentDrawing.id!);
      this.drawingsLinks.push(Object.assign({}, this.currentDrawing));
         } catch (error) {
      alert(error);
    }
  }


  async drawingLinkClick(elem:any) {
    try {
      this.spNavigator = undefined;
      this.clearInfo();
      const index=+(elem as HTMLElement).innerText.split(' ')[0];
      await this.getDrawingInfo(this.drawingsLinks[index].id);
      this.drawingsLinks.length=index+1;
    } catch (error) {
      alert(error);
    }
  }


  async getDrawingInfo(id: number) {
    try {
      //this.blank = undefined;
      let data: any;
      data = await this.appService.query('get', `http://localhost:3000/drawings/getDrawingInfoFull/${id}/id`);
      if (data.blank) {
        this.blank = this.drawingsDbService.showBlankInfo(data.blank, data.drawing.type_blank);
      }
      if (data.materials) {
        this.drawingsDbService.showMaterialInfo(this.materials, data.materials);
      }
      console.log('data.positionsSP', data.positionsSP)
      if (data.positionsSP) {
        this.specificatios = data.positionsSP;
      }
    } catch (error) {
      alert(error);
    }
  }


  clearInfo() {
    this.blank = undefined;
    this.materials.length = 0;
    this.specificatios.length = 0;
    this.spNavigator = undefined;
  }


  showMain() {
    this.clearInfo();
    this.showDetail = false;
    this.tblNavigator = undefined;
    this.drawingsLinks.length = 0;
  }

  firstPage() { }
  previousPage() { }
  nextPage() { }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('idmaterial')!.dispatchEvent(event);

  }
}
