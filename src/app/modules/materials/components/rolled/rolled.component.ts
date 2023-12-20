import { Navigation } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Isteel, IrolledType, Irolled, Imaterial } from './iMaterials';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';


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
  @ViewChild('rolledModal', { static: false })
  rolledForm!: NgForm;
  links:number[]=[1,2,3,4,5];

  loadTemplate(rolled: Irolled) {
    if (rolled.isEdited === undefined) {
      return this.readOnlyTemplate
    } else {
      return this.editTemplate;
    }
  }

  async onLoad() {
    try {
      const data:Imaterial = await this.appService.query('get', 'http://localhost:3000/materials/onLoad');
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
      alert(error);
    }
  }


  async getRolleds(rolledtype: number, steel: number, position: number) {
    try {
      const data:Imaterial = await this.appService.query('get', `http://localhost:3000/materials/rolleds/${rolledtype}/${steel}/${position}`);
   
      if ((data.rolleds as []).length !== 0) {
        this.rolleds = data.rolleds;
      }
    } catch (error) {
      alert(error);
    }
  }

 /*  async getRolled(url: string) {
    try {
      const data = await this.appService.query('get',url);
      if ((data as []).length !== 0) {
        this.rolleds = data;
      }
    } catch (error) {
      alert(error);
    }
  } */


  addRoll() { }

  ngOnInit(): void {
    this.onLoad();
   
    let event = new Event("click");
    document.getElementById('searchMaterial')!.dispatchEvent(event);
  }
}
