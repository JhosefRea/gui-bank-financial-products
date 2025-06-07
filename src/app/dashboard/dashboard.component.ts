import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { FetchApiProductsService } from '../../services/fetch-api-products.service';
import { ProductStateService } from '../../services/product-state.service';
import { ProductDTO } from '../dtos/product.dto';
import { ProductLabels, AppRoutes } from '../../shared/utils/enums/product.enum';
import { extractColumnKeys } from '../../shared/utils/utils';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: ProductDTO[] = [];
  columnKeys: string[] = [];
  columnLabels: string[] = Object.values(ProductLabels);

  //EDIT
  openDropdownId: string | null = null;

  //PAGINATION
  pageSizes: number[] = [5, 10, 20];
  itemsPerPage: number = 5;
  paginatedProducts: ProductDTO[] = []; // Visibles según el select

  constructor(
    private fetchApiProducts: FetchApiProductsService, 
    private router: Router,
    private productStateService: ProductStateService
  ) {}

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

  // EDIT
  onEdit(product: ProductDTO): void {
    if (product?.['id']) {
      this.router.navigate([AppRoutes.EditProduct, product['id']]);
      this.productStateService.selectProduct(product)
    } else {
      console.warn('Producto sin ID, no se puede renderizar:', product);
    }
  }

  // PAGINATION
  onItemsPerPageChange(): void {
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    this.paginatedProducts = this.products.slice(0, this.itemsPerPage);
  }
  
}

