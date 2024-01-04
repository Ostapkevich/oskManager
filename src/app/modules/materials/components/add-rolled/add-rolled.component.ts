import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';


@Component({
  standalone: true,
  selector: 'add-rolled',
  templateUrl: './add-rolled.component.html',
  styleUrls: ['./add-rolled.component.css']
})
export class AddRolledComponent {
  constructor(private appService: AppService) { }


  @Output() save_NewRolled = new EventEmitter();
  @Output() btn_Del = new EventEmitter();

  saveNewRolled() {
    this.save_NewRolled.emit();
  }

  async btnDel() {
    this.btn_Del.emit();
  }
}
