import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDTO } from '../app/dtos/product.dto';

@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private selectedProduct$ = new BehaviorSubject<ProductDTO | null>(null);

  selectProduct(product: ProductDTO): void {
    this.selectedProduct$.next(product);
  }

  getSelectedProduct() {
    return this.selectedProduct$.asObservable();
  }
}