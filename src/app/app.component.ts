import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

 
})
export class AppComponent implements OnInit {
 

  title = 'ОСК-менеджер';
 
  showNav: boolean = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/viewDrawing') {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }
  

  


  ngOnInit(): void {
    initFlowbite();
  
     
  }

}
