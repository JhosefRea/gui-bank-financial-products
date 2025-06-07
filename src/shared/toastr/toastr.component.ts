import { Component } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toastr',
  imports: [],
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.scss',
})
export class ToastrComponent {
  constructor(private toastr: ToasterService) {}
  private showAlert(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    success: boolean
  ) {
    const response = {
      success,
      message,
      type,
    };
    this.toastr.handleResponse(response);
  }

  showSuccess(message: string) {
    this.showAlert('success', message, true);
  }

  showError() {
    this.showAlert('error', 'Error al crear el usuario.', false);
  }

  showInfo() {
    this.showAlert('info', 'Verifica tus datos antes de continuar.', true);
  }

  showWarning() {
    this.showAlert(
      'warning',
      'El campo de correo electrónico es obligatorio.',
      false
    );
  }
}
