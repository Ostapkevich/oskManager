import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports:[DatePipe],
})
export class HomeComponent implements OnInit {
data=new Date();
interval(){
  setInterval(()=>this.data=new Date(),10000);
}

dayToday= this.data.toLocaleDateString('ru-RU',{ weekday: 'long' }).charAt(0).toUpperCase()+this.data.toLocaleDateString('ru-RU',{ weekday: 'long' }).slice(1);
ngOnInit(): void {
  this.interval();
}

}
