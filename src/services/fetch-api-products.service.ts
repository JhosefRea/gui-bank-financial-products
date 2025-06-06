import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ProductDTO } from '../app/dtos/product.dto';

@Injectable({
  providedIn: 'root'
})
export class FetchApiProductsService {
  static apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAll(): Observable<ProductDTO[]> {
    return this.http
      .get<{ data: ProductDTO[] }>(FetchApiProductsService.apiUrl)
      .pipe(
        map(res => {
          const products = this.extractResponseData(res);
          console.log('Productos recibidos:', products); 
          return products;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status: ${error.status}, ` +
        `Error Body: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(() => new Error('Error in conection to API'));
  }

  private extractResponseData(res: { data: any[] }): any[] {
    return res.data || [];
  }
}
