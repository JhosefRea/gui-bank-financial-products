import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AsyncValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';

import { FetchApiProductsService } from '../../../services/fetch-api-products.service';

@Component({
  selector: 'app-product-create',
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
      date_revision: ['', [Validators.required, this.DateValidator()]],
    });

    // Volver a validar la fecha de revisión si cambia la de liberación
    this.productForm.get('date_release')?.valueChanges.subscribe(() => {
      this.productForm.get('date_revision')?.updateValueAndValidity();
    });
  }


  // Reiniciar
  onReset(): void {
    this.productForm.reset();
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          alert('Producto creado con éxito');
          this.productForm.reset();
          this.router.navigate(['/dashboard'])
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


  // Validación: fecha de liberación ≥ hoy
  releaseDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value >= today ? null : { releaseDateInvalid: true };
    };
  }

  // Validación: revisión = liberación + 1 año
  DateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const release = this.productForm?.get('date_release')?.value;
      if (!release || !control.value) return null;
      const releaseDate = new Date(release);
      const revisionDate = new Date(control.value);

      releaseDate.setFullYear(releaseDate.getFullYear() + 1);

      const releaseFormatted = releaseDate.toISOString().split('T')[0];
      const revisionFormatted = revisionDate.toISOString().split('T')[0];

      return revisionFormatted === releaseFormatted ? null : { revisionDateInvalid: true };
    };
  }

  // Validación Asíncrona de ID duplicado en el FORMGROUP
  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;

      return this.productService.verifyIdExists(id).pipe(
        map(exists => (exists ? { idExists: true } : null))
      );
    };
  }

  
}

