import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { FetchApiProductsService } from '../../../services/fetch-api-products.service';
import { ProductDTO } from '../../dtos/product.dto';
import { ProductStateService } from '../../../services/product-state.service';
import { AppRoutes } from '../../../shared/utils/enums/product.enum';


@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  productForm!: FormGroup;
  selectedProduct: ProductDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fetchApiProducts: FetchApiProductsService,
    private productStateService: ProductStateService
  ) {}

  ngOnInit(): void {
    this.setProduct();

    if (!this.selectedProduct) {
      console.warn('No se recibió producto para editar');
      return;
    } else {

    }
    
    this.productForm = this.fb.group({
      id: [
        { value: this.selectedProduct['id'], disabled: true },
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.releaseDateValidator()]],
      date_revision: ['',],
    });

    // Valor por defecto de date_revision basado en date_release
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        const formattedRevisionDate = revisionDate.toISOString().split('T')[0];

        this.productForm.get('date_revision')?.setValue(formattedRevisionDate, { emitEvent: false });
        this.productForm.get('date_revision')?.markAsTouched();
      }
    });
  }
  releaseDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value >= today ? null : { releaseDateInvalid: true };
    };
  }

  setProduct(): void {
    this.productStateService.getSelectedProduct().subscribe(product => {
      if (product) this.selectedProduct = product;
    });
    console.log("EDIT PRODUCT COMPONENT", this.selectedProduct)
  
  }

  updateProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Resalta los campos inválidos en la interfaz
      return;
    }
    const payload = this.productForm.getRawValue();

    this.fetchApiProducts.updateProduct(payload.id, payload).subscribe({
      next: () => {
        alert('Producto actualizado con éxito');
        this.router.navigate([AppRoutes.Dashboard]);
      },
      error: (err) => console.error('Error al actualizar el producto:', err),
    });
  }

  // Reiniciar el formulario
  onReset(): void {
    this.productForm.reset();
  }

}
