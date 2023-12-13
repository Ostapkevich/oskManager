import { Navigation } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Isteel, IrolledType, Irolled, Imaterial } from './iMaterials';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-rolled',
  templateUrl: './rolled.component.html',
  styleUrls: ['./rolled.component.css']
})
export class RolledComponent implements OnInit {

  constructor(private appService: AppService) {

  }

  units: string = ''
  rolledType: IrolledType[] | undefined;
  steels: Isteel[] | undefined
  rolleds: Irolled[] | undefined;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;

  loadTemplate(rolled: Irolled) {
    if (rolled.isEdited === undefined) {
      return this.readOnlyTemplate
    } else {
      return this.editTemplate;
    }
  }

  async getData(url: string) {
    try {
      const data:Imaterial = await this.appService.get(url);
      if ((data.rolled_type as []).length !== 0) {
        this.rolledType = data.rolled_type;
      }
      if ((data.steels as []).length !== 0) {
        this.steels = data.steels;
      }
      if ((data.rolleds as []).length !== 0) {
        this.rolleds = data.rolleds;
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }

  async getRolled(url: string) {
    try {
      const data = await this.appService.get(url);
      if ((data as []).length !== 0) {
        this.rolleds = data;
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }


  addRoll() { }

  ngOnInit(): void {
    this.getData('http://localhost:3000/materials/rolled');
    let event = new Event("click");
    document.getElementById('searchMaterial')!.dispatchEvent(event);
  }
}
