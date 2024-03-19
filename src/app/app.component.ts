import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
 
})
export class AppComponent implements OnInit {
 

  title = 'ОСК-менеджер';
  userName: string = '';
  path='assets/СВ35-501 Удлинитель к борштангше.jpg';


  ngOnInit(): void {
    initFlowbite();
    this.userName = 'Петров В.К.';
     
  }

}
