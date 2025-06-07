import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FetchApiProductsService } from '../../../services/fetch-api-products.service';
import { AppRoutes } from '../../../shared/utils/enums/product.enum';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: FetchApiProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idExistsValidator()]
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

  onReset(): void {
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          alert('Producto creado con éxito');
          this.productForm.reset();
          this.router.navigate([AppRoutes.Dashboard]);
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          alert('Error al crear el producto');
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  releaseDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value >= today ? null : { releaseDateInvalid: true };
    };
  }

  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;
      return this.productService.verifyIdExists(id).pipe(
        map(exists => (exists ? { idExists: true } : null))
      );
    };
  }
}
