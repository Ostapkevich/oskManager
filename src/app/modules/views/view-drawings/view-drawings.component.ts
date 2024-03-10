import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';
import { FormsModule, NgForm } from '@angular/forms';

interface Idrawings {
 idDrawing:number
  type_position: number,
  numberDrawing: string,
  name_item: string,
 // quantity: number,
  weight: number,
  uselength: number,
  len: number | null,
  dw: number,
  h: number | null,
  specific_units: number,
  units: number,
  percent: number | null,
  value: number | null,
  plasma: boolean | null|number,
  nameDrawing: string,
  type_blank:number
}


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-viewDrawings',
  templateUrl: './view-drawings.component.html',
  styleUrls: ['./view-drawings.component.css']
})
export class ViewDrawingsComponent implements OnInit {
  constructor(private appService: AppService) { }

  idDrawing: number | undefined;
  number_item: string = '';
  name_item: string = '';
 min: number | undefined;
  max: number | undefined;
 @Input() showElement=true;


  //isDrawingInfo = false;
  collections: Idrawings[] = [];
  page: number = 1;
  tblNavigator: TableNavigator | undefined;
  showFull = true;
  



  async onSubmit() {
    try {
    this.collections.length=0;
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
      } else{
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

  showDrawing(element: any) { }

  firstPage() { }
   previousPage() { }
   nextPage() { }

   ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('idmaterial')!.dispatchEvent(event);
   
  }
}
