import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AppRoutes } from '../../utils/enums/product.enum';
import { SearchService } from '../../../services/product-search.service';
import { ProductRegisterAlertSms } from '../../utils/enums/alert-sms-toast.enum';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `<input type="text" (input)="search($event)" placeholder="Buscar...">`,
  styles: [],
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchText: string = '';
  AppRoutes = AppRoutes;
  
  constructor(
    public router: Router,
    private searchService: SearchService
  ) {}

  search(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchService.updateSearch(term);
  }

}
