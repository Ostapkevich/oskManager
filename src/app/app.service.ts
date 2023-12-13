import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpAppClient: HttpClient) { }

  get(url:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpAppClient.get(url).subscribe(
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

  put(url:string, obj:any): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpAppClient.put(url,obj).subscribe(
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
 
  delete(url:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpAppClient.delete(url).subscribe(
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
