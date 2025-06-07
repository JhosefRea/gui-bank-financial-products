import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FetchApiProductsService } from '../../services/fetch-api-products.service';
import { ProductStateService } from '../../services/product-state.service';
import { ProductDTO } from '../dtos/product.dto';
import { ProductLabels, AppRoutes } from '../../shared/utils/enums/product.enum';
import { extractColumnKeys } from '../../shared/utils/utils';
import { SearchService } from '../../services/product-search.service';

@Component({
  standalone:true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  template: `
    <table>
      <tr *ngFor="let item of filteredItems">
        <td>{{ item }}</td>
      </tr>
    </table>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  products: ProductDTO[] = [];
  columnKeys: string[] = [];
  columnLabels: string[] = Object.values(ProductLabels);
  filteredItems = [...this.products];
  

  //EDIT
  openDropdownId: string | null = null;

  //PAGINATION
  itemsPerPage: number = 5;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 20];

  constructor(
    private fetchApiProducts: FetchApiProductsService, 
    private router: Router,
    private productStateService: ProductStateService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getProducts(); 
    this.searchService.searchTerm$.subscribe((term) => {
      if (term.trim() === '') {
        this.filteredItems = [...this.products]; 
      } else {
        this.filteredItems = this.products.filter((item) =>
          item.name.toLowerCase().includes(term.toLowerCase())
        );
      }
    });
  }
  
  getProducts(): void {
    this.fetchApiProducts.getAll().subscribe({
      next: (data: ProductDTO[]) => {
        this.products = data;
        this.columnKeys = extractColumnKeys(data);      
        this.filteredItems = [...this.products];
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
  
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

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
  }
  
}

