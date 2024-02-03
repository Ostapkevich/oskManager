import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableNavigator } from 'src/app/classes/tableNavigator';
import { AppService } from 'src/app/app.service';
import { FormsModule, NgForm } from '@angular/forms';

interface Idrawing {
  id_item: number,
  name_item: string,
  isp:number,
  number_item: string,
  weight: number,
  path:string[],
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


  isDrawingInfo = false;
  collections: Idrawing[] = [];
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
      if ((data.drawings as []).length !== 0) {
        this.collections = data.drawings;
        if (!this.tblNavigator) {
          this.tblNavigator = new TableNavigator(document.getElementById('tblDrawings') as HTMLTableElement, 0);
        }
       
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
