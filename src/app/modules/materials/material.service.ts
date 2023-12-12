import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MaterialService {

  constructor(private httpMaterials: HttpClient) { }

  getData(url:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpMaterials.get(url).subscribe(
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
    
 

}
