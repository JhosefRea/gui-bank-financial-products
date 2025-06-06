import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ProductDTO } from '../app/dtos/product.dto';
import { IProductOrderedKeys } from '../app/interfaces/ProductOrderedKeys.interface';
import { ProductKeys } from '../shared/utils/enums/product.enum';


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
          let products = this.extractResponseData(res);
          console.log('Productos recibidos:', products); 
          
          const order: string[] = Object.values(ProductKeys);

          // Reordenar cada producto según 'order'
          const orderedProducts = products.map(product => {
            const orderedProduct: IProductOrderedKeys = {};
            order.forEach(key => {
              orderedProduct[key] = product[key];
            });
            return orderedProduct;
          });
          
          console.log('Productos ordenados:', orderedProducts); 
          products = orderedProducts
          return products;
        }),
        catchError(this.handleError)
      );
  }

  public createProduct(productData: ProductDTO): Observable<ProductDTO> {
    return this.http
      .post<ProductDTO>(FetchApiProductsService.apiUrl, productData)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  verifyIdExists(id: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${FetchApiProductsService.apiUrl}/verification/${id}`)
      .pipe(map(res => res.exists));
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
