import { Component, Output, EventEmitter} from '@angular/core';


@Component({
  standalone:true,
  selector: 'add-hardware',
  templateUrl: './add-hardware.component.html',
  styleUrls: ['./add-hardware.component.css']
})
export class AddHardwareComponent {
constructor(){}

  @Output()save_NewHardware = new EventEmitter();
  @Output()btn_Del = new EventEmitter();
  
  saveNewHardware() {
      this.save_NewHardware.emit();
  }

  btnDel(){
this.btn_Del.emit();
  }
 

}
