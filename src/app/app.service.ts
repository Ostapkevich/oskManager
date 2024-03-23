import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpAppClient: HttpClient) { }

  query(method: 'get' | 'post' | 'put' | 'delete' | 'blob', url: string, body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let call;
      switch (method) {
        case 'get':
          if (body) {
            if (Array.isArray(body)) {
              let param = new HttpParams();
              let j = 0;
              for (const i of body) {
                param = param.append(String('sql' + j), i);
                j++;
              }
              call = this.httpAppClient.get(url, { params: param });
            } else {
              const param = new HttpParams({ fromObject: body });
              call = this.httpAppClient.get(url, { params: param });
            }
          } else {
            call = this.httpAppClient.get(url);
          }
          break;
        case 'post':
          call = this.httpAppClient.post(url, body);
          break;
        case 'put':
          call = this.httpAppClient.put(url, body);
          break;
        case 'delete':
          let par = new HttpParams();
          if (body) {
            let j = 0;
            for (const i of body) {
              par = par.append(String('q' + j), i);
              j++;
            }
            call = this.httpAppClient.delete(url, { params: par });
            break;
          }
          call = this.httpAppClient.delete(url);
          break;
        case 'blob':
          call = this.httpAppClient.get(url, { params: new HttpParams().append('path', body), responseType: 'blob' });
          break
      }
      call.subscribe(
        {
          next: (data: any) => {
            if (data.serverError) {
              reject(new Error(data.serverError));
            }
            else {
              resolve(data);
            }
          }
          ,
          error: error => {
            reject(error)
          }
        }
      );
    })
  }

}