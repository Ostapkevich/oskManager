import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ItypeMaterial } from './itype-material';
import { TableNavigator } from 'src/app/classes/tableNavigator';


@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'type-material',
  templateUrl: './type-material.component.html',
  styleUrls: ['./type-material.component.css']
})
export class TypeMaterialComponent implements OnInit {
  constructor(private appService: AppService) { }
  index: number = 0;
  changedData = false;
  typesMaterial: Partial<ItypeMaterial>[] = [];
  tblNavigator: TableNavigator | undefined;
  selectedType: string = '';
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;
  @ViewChild('newTemplate', { static: false })
  newTemplate!: TemplateRef<any>;

  escape(event: Event) {
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement);
    this.typesMaterial.splice(index, 1);
  }

  async changeType() {
    try {
      const materialType = (document.getElementById('types-material') as HTMLSelectElement).value;

      if ((document.getElementById('types-material') as HTMLSelectElement).selectedIndex === 0) {
        this.selectedType = '';
        this.typesMaterial!.length = 0;
        return;
      }
      const element = document.getElementById('types-material') as HTMLSelectElement;
      this.selectedType = element.options[element.selectedIndex].textContent!;
      const data = await this.appService.query('get', `http://localhost:3000/types/getTypes/${materialType}`);
      this.typesMaterial!.length = 0;
      if ((data.typesMaterial as []).length !== 0) {
        this.typesMaterial = data.typesMaterial;
      }
    } catch (error) {
      alert(error);
    }
  }

  loadTemplate(type: Partial<ItypeMaterial>) {
    if (type.id_type && type.newOrEdit === undefined) {
      return this.readOnlyTemplate
    } else if (type.id_type && type.newOrEdit === true) {
      return this.editTemplate;
    } else {
      return this.newTemplate;
    }
  }

  editeRow(event: Event) {
    if (this.changedData === true) {
      return
    }
    this.index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement);
    this.typesMaterial[this.index].newOrEdit = true;
    this.typesMaterial[this.index].uselength = 0;
    this.changedData = true;
  }

  async saveTypes() {
    try {
      if (this.changedData === false) {
        return;
      }
      let sentTypes: Partial<ItypeMaterial>[] = [];
      let i = 0;
      for (const item of this.typesMaterial) {
        sentTypes.push(item);
        delete sentTypes[i].newOrEdit;
        sentTypes[i].ind = i;
        i++;
      }
      const data = await this.appService.query('put', `http://localhost:3000/types/saveTypes/${(document.getElementById('types-material') as HTMLSelectElement).value}`, sentTypes);
       if ((data.typesMaterial as []).length !== 0) {
        this.typesMaterial!.length = 0;
        this.typesMaterial = data.typesMaterial;
      }
      alert('Данные сохранены!');
      this.changedData = false;
    } catch (error) {
      alert(error);
    }
  }

 uselengthChange(target:any){
  this.index = this.tblNavigator!.findRowSelect(target);
  this.typesMaterial[this.index].uselength=+target.value;
 }

  escapeAll() {
     if (this.changedData === false) {
       return;
     } else {
       if (confirm("Отменить все несохраненные изменения?") === false) {
         return;
       }
     }
     this.changeType();
     this.changedData = false; 
  }

  moveItem(isMoveUp: boolean) {
    let i = this.tblNavigator?.findCheckedRowNumber();
    if (i !== null) {
      const unit = this.typesMaterial[i!];
      if (isMoveUp && i! > 0) {
        this.typesMaterial[i!] = this.typesMaterial[i! - 1];
        this.typesMaterial[i! - 1] = unit;
      } else if (!isMoveUp && i! < this.typesMaterial.length - 1) {
        this.typesMaterial[i!] = this.typesMaterial[i! + 1];
        this.typesMaterial[i! + 1] = unit;
      }
      this.changedData=true;

    }
  }

 
  addType() {
    const editedType: Partial<ItypeMaterial> = {};
    let index = this.tblNavigator!.findCheckedRowNumber();
    editedType.id_type = null;
    editedType.uselength = 0;
    editedType.name_type = '';
    editedType.newOrEdit = true;
    if (index === null) {
      this.typesMaterial.push(editedType);
    } else {
      this.typesMaterial.splice(index + 1, 0, editedType);
    }
    this.changedData = true;
  }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('tblType')!.dispatchEvent(event);
    this.tblNavigator = new TableNavigator(document.getElementById('tblType') as HTMLTableElement, 0, 3,2);

  }
}
