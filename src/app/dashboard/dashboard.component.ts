import { Component, OnInit } from '@angular/core';
import { FetchApiProductsService } from '../../services/fetch-api-products.service';
import { CommonModule } from '@angular/common';

import { ProductDTO } from '../dtos/product.dto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: ProductDTO[] = [];

  constructor(private fetchApiProducts: FetchApiProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  // Fetch invoices from the service
  getProducts(): void {
    this.fetchApiProducts.getAll().subscribe({
      next: (data: ProductDTO[]) => {
        this.products = data;
        console.log('Invoices fetched successfully:', this.products);
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
      },
    });
  }
}

