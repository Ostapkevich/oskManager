import { Component, OnInit } from '@angular/core';
import { RolledComponent } from 'src/app/modules/materials/components/rolled/rolled.component';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from 'src/app/modules/materials/components/hardware/hardware.component';


@Component({
  imports: [RolledComponent, CommonModule, HardwareComponent],
  standalone: true,
  selector: 'app-drawings-database',
  templateUrl: './drawings-database.component.html',
  styleUrls: ['./drawings-database.component.css']
})
export class DrawingsDatabaseComponent implements OnInit {

  isDetail: boolean = true;
  isRolled: boolean = true;
  isHardware: boolean = false;
  isMaterial: boolean = false;
  
  rolledComponent() {
    this.isRolled = true;
    this.isHardware = false;
    this.isMaterial = false;
  }

  hardwareComponent() {
    this.isRolled = false;
    this.isHardware = true;
    this.isMaterial = false;
  }

  materialComponent() {
    this.isRolled = false;
    this.isHardware = false;
    this.isMaterial = true;
  }

  ngOnInit(): void {
    let event = new Event("click");
    document.getElementById('drawing-search')!.dispatchEvent(event);
  }
}
