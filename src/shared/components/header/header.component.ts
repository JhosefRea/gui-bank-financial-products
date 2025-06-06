import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchText: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  constructor(public router: Router) {}

  onSearch(): void {
    this.search.emit(this.searchText);
  }

  onAdd(): void {
    this.add.emit();
  }

}
