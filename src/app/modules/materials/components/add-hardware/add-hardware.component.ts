import { Component, Output, EventEmitter} from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  standalone:true,
  selector: 'add-hardware',
  templateUrl: './add-hardware.component.html',
  styleUrls: ['./add-hardware.component.css']
})
export class AddHardwareComponent {
constructor(private appService:AppService){}

  @Output()save_NewHardware = new EventEmitter();
  @Output()btn_Del = new EventEmitter();
  
  saveNewHardware() {
      this.save_NewHardware.emit();
  }

  btnDel(){
this.btn_Del.emit();
  }
 

}
