import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Iunits } from './IUnits';


@Injectable()
export class EditUnitsService {

  constructor(private httpEditUnits: HttpClient) { }

  loadOrder(id: string) {
    return this.httpEditUnits.get(`http://localhost:3000/editUnits/getOrder-${id}`);
  }

  loadUnits(id: string) {
    return this.httpEditUnits.get(`http://localhost:3000/editUnits/getUnits-${id}`);
  }

  saveUnits(units:Partial <Iunits>[]){
    return this.httpEditUnits.put(`http://localhost:3000/editUnits/saveUnits`, units ); 
}
}