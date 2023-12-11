import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Iunits } from './IUnits';


@Injectable()
export class EditUnitsService {

  constructor(private httpEditUnits: HttpClient) { }

  loadOrder(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpEditUnits.get(`http://localhost:3000/editUnits/getOrder-${id}`).subscribe(
        {
          next: (data: any) => {
            if (data.serverError) {
              reject(new Error(data.serverError));
            }
            resolve(data);
          }
          ,
          error: error => reject(error) 
        }
      );
    })
  }

  loadUnits(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpEditUnits.get(`http://localhost:3000/editUnits/getUnits-${id}`).subscribe(
        {
          next: (data: any) => {
            if (data.serverError) {
              reject(new Error(data.serverError));
            }
            resolve(data);
          }
          ,
          error: error=> reject(error)
        }
      );
    })
  }


  isEmptyUnit(idSp: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpEditUnits.get(`http://localhost:3000/editUnits/isEmptyUnit-${idSp}`).subscribe(
        {
          next: (data: any) => {
            if (data.serverError) {
              let error: Error
              reject(new Error(data.serverError));
            } else {
              resolve(data);
            }
          },
          error: error => reject(error)
        }
      );
    });
  }



  deleteUnit(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpEditUnits.delete(`http://localhost:3000/editUnits/deleteUnit-${id}`).subscribe(
        {
          next: (data: any) => {
            if (data.serverError) {
              let error: Error
              reject(error = new Error(data.serverError));
            } else {
              resolve(data);
            }
          }
          ,
          error: error => reject(error)
        }
      );
    });
  }

  saveUnits(units: Partial<Iunits>[]) {
    return this.httpEditUnits.put(`http://localhost:3000/editUnits/saveUnits`, units);


  }
}