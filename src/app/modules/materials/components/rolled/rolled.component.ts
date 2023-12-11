import { Component } from '@angular/core';
import { Navigation } from '@angular/router';

@Component({
  selector: 'app-rolled',
  templateUrl: './rolled.component.html',
  styleUrls: ['./rolled.component.css']
})
export class RolledComponent {
  units:string=''

  addRoll(){}

  loadTemplate(unit:string){}
}
