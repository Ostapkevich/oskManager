import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports:[CommonModule],
  selector: 'add-rolled',
  templateUrl: './add-rolled.component.html',
  styleUrls: ['./add-rolled.component.css']
})
export class AddRolledComponent {
  constructor() { }

@Input() materialType=0;
  @Output() save_NewRolled = new EventEmitter();
  @Output() btn_Del = new EventEmitter();

  saveNewRolled() {
    
    this.save_NewRolled.emit();
  }

  async btnDel() {
    this.btn_Del.emit();
  }
}
