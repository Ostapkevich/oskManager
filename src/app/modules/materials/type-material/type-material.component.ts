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
  typesMaterial: Partial<ItypeMaterial>[] = [];
  tblNavigator: TableNavigator | undefined;
  selectedType: string = 'Выберите тип материала';
  @ViewChild('readOnlyRolledTemplate', { static: false })
  readOnlyRolledTemplate!: TemplateRef<any>;
  @ViewChild('editRolledTemplate', { static: false })
  editRolledTemplate!: TemplateRef<any>;
  @ViewChild('newRolledTemplate', { static: false })
  newRolledTemplate!: TemplateRef<any>;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;
  @ViewChild('newTemplate', { static: false })
  newTemplate!: TemplateRef<any>;




  escapeAdded(event: Event) {
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 1);
    this.typesMaterial.splice(index, 1);
  }

  escape(event: Event) {
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 1);
    this.typesMaterial[index].newOrEdit = false;
    switch (this.selectedType) {
      case 'Прокат':
        this.typesMaterial[index].name_type = this.typesMaterial[index].initial_name_type;
        this.typesMaterial[index].uselength = this.typesMaterial[index].initial_uselength;
        break;
      case 'Материалы':
        this.typesMaterial[index].name_type = this.typesMaterial[index].initial_name_type;
        break;
      default:
        this.typesMaterial[index].name_type = this.typesMaterial[index].initial_name_type;
        break;
    };
  }

  async deleteType() {
    try {
      const index = this.tblNavigator!.findCheckedRowNumber();
      if (index === null || index < 0) {
        return;
      }
      const materialType = (document.getElementById('types-material') as HTMLSelectElement).value;
      const data = await this.appService.query('delete', `http://localhost:3000/types/deleteType/${materialType}/${this.typesMaterial[index].id_type}`);
      this.typesMaterial!.length = 0;
      if ((data.typesMaterial as []).length !== 0) {
        this.typesMaterial = data.typesMaterial;
      }
    } catch (error) {
      alert(error);
    }
  }

  async changeType() {
    try {
      const materialType = (document.getElementById('types-material') as HTMLSelectElement).value;

      if ((document.getElementById('types-material') as HTMLSelectElement).selectedIndex === 0) {
        this.selectedType = 'Выберите тип материала';
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
    if (type.id_type && (type.newOrEdit === false || type.newOrEdit === undefined)) {
      return this.selectCase('readOnly');
    } else if (type.id_type && type.newOrEdit === true) {
      return this.selectCase('edit');
    } else {
      return this.selectCase('new');
    }
  }

  selectCase(action: string): any {
    switch (action) {
      case 'readOnly':
        switch (this.selectedType) {
          case 'Прокат':
            return this.readOnlyRolledTemplate;
          default:
            return this.readOnlyTemplate;
        };
      case 'edit':
        switch (this.selectedType) {
          case 'Прокат':
            return this.editRolledTemplate;
          default:
            return this.editTemplate;
        }
      case 'new':
        switch (this.selectedType) {
          case 'Прокат':
            return this.newRolledTemplate;
          default:
            return this.newTemplate;
        }
    }
  }

  editeRow(event: Event) {
    const index = this.tblNavigator!.findRowButton(event.target as HTMLButtonElement, 1);
    this.typesMaterial[index].newOrEdit = true;
    switch (this.selectedType) {
      case 'Прокат':
        this.typesMaterial[index].initial_name_type = this.typesMaterial[index].name_type;
        this.typesMaterial[index].initial_uselength = this.typesMaterial[index].uselength;
        this.typesMaterial[index].uselength = 0;
        break;
      case 'Материалы':
        this.typesMaterial[index].initial_name_type = this.typesMaterial[index].name_type;
        break;
      default:
        this.typesMaterial[index].initial_name_type = this.typesMaterial[index].name_type;
        break;
    };

  }

  async saveTypes() {
    try {

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
      //this.changedData = false;
    } catch (error) {
      alert(error);
    }
  }

  uselengthChange(target: any) {
    const index = this.tblNavigator!.findRowSelect(target, 2);
    this.typesMaterial[index].uselength = +target.value;
  }

  escapeAll() {
    if (confirm("Отменить все несохраненные изменения?") === false) {
      return;
    }
    this.changeType();
  }

  moveItem(isMoveUp: boolean) {
    if ((document.getElementById('types-material') as HTMLSelectElement).selectedIndex === 0) {
      return;
    }
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
    }
  }


  addType() {
    if ((document.getElementById('types-material') as HTMLSelectElement).selectedIndex === 0) {
      return;
    }
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
  }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('tblType')!.dispatchEvent(event);
    this.tblNavigator = new TableNavigator(document.getElementById('tblType') as HTMLTableElement, 0);

  }
}
