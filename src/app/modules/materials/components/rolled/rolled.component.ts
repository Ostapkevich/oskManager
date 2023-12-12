import { Navigation } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MaterialService } from '../../material.service';
import { ItypeAndsteel, Irolled } from './iMaterials';


@Component({
  selector: 'app-rolled',
  templateUrl: './rolled.component.html',
  styleUrls: ['./rolled.component.css']
})
export class RolledComponent implements OnInit {

  constructor(private materialService: MaterialService) {

  }

  units: string = ''
  typeAndSteel: ItypeAndsteel | undefined;
  rolleds: Irolled[] | undefined;
  @ViewChild('readOnlyTemplate', { static: false })
  readOnlyTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false })
  editTemplate!: TemplateRef<any>;

  loadTemplate(rolled: Irolled) {
    if (rolled.isEdited===undefined) {
      return this.readOnlyTemplate
    } else {
      return this.editTemplate;
    }
  }


  async getData(url: string) {
    try {
      const data = await this.materialService.getData(url);
      if ((data as []).length !== 0) {
        switch (url) {
          case 'http://localhost:3000/materials/rolledTypeAndSteel':
            this.typeAndSteel = data;
            break;
          case 'http://localhost:3000/materials/rolled':
            this.rolleds = data;
            break;
          default:
            break;
        }
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }


  async loadSteels(url: string) {
    try {
      const data = await this.materialService.getData(url);
      if ((data as []).length !== 0) {
        this.typeAndSteel = data;
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }


  addRoll() { }

  ngOnInit(): void {
    this.getData('http://localhost:3000/materials/rolledTypeAndSteel');
    this.getData('http://localhost:3000/materials/rolled');
    let event = new Event("click");
    document.getElementById('searchMaterial')!.dispatchEvent(event);
  }
}
