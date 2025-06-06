import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FetchApiProductsService } from '../../services/fetch-api-products.service';
import { ProductDTO } from '../dtos/product.dto';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: ProductDTO[] = [];
  columnKeys: string[] = [];
  columnLabels: string[] = ['Logo', 'Nombre del producto', 'Descripción', 'Fecha de liberación', 'Fecha de reestructuración'];


  constructor(private fetchApiProducts: FetchApiProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.fetchApiProducts.getAll().subscribe({
      next: (data: ProductDTO[]) => {
        this.products = data;
        if (data.length > 0) {
          this.columnKeys = Object.keys(data[0]).filter(i => i !== 'id'); 
        }
        console.log('products fetched successfully:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
}

