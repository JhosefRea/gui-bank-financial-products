import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { FetchApiProductsService } from '../../services/fetch-api-products.service';
import { ProductDTO } from '../dtos/product.dto';
import { ProductLabels, AppRoutes } from '../../shared/utils/enums/product.enum';
import { extractColumnKeys } from '../../shared/utils/utils';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: ProductDTO[] = [];
  columnKeys: string[] = [];
  columnLabels: string[] = Object.values(ProductLabels);
  openDropdownId: string | null = null;

  constructor(private fetchApiProducts: FetchApiProductsService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.fetchApiProducts.getAll().subscribe({
      next: (data: ProductDTO[]) => {
        this.products = data;
          this.columnKeys = extractColumnKeys(data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  // Mostrar u ocultar el dropdown del producto seleccionado
  toggleDropdown(productId: string): void {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  onEdit(product: any): void {
    if (product?.id) {
      this.router.navigate([AppRoutes.EditProduct, product.id]);
    } else {
      console.warn('Producto sin ID, no se puede renderizar:', product);
    }
  }
}

