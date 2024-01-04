import { Component, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';


@Component({
  standalone: true,
  selector: 'add-others',
  templateUrl: './add-others.component.html',
  styleUrls: ['./add-others.component.css']
})
export class AddOthersComponent {
  constructor(private appService: AppService) { }

  @Output() save_Material = new EventEmitter();
  @Output() btn_Del = new EventEmitter();

  saveNewMaterial() {
    this.save_Material.emit();
  }

  btnDel() {
    this.btn_Del.emit();
  }

  radioChange(name: string) {
    if (name === 'lradio') {
      (document.getElementById('sradio') as HTMLInputElement).checked = false;
    } else {
      (document.getElementById('lradio') as HTMLInputElement).checked = false;
    }
  }
}

