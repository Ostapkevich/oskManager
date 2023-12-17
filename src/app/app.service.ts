import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpAppClient: HttpClient) { }

  query(method: 'get' | 'post' | 'put' | 'delete', url: string, body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let callBack;
      switch (method) {
        case 'get':
          callBack = this.httpAppClient.get(url);
          break;
        case 'post':
          callBack = this.httpAppClient.post(url, body);
          break;
        case 'put':
          callBack = this.httpAppClient.put(url, body);
          break;
        case 'delete':
          let par = new HttpParams();
          let j = 0;
          for (const i of body as []) {
            par = par.append(String('q' + j), i);
            j++;
          }
          callBack = this.httpAppClient.delete(url, { params: par });
          break;
      }
      callBack.subscribe(
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
