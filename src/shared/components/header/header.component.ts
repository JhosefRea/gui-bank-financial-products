import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchText: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  onSearch(): void {
    this.search.emit(this.searchText);
  }

  onAdd(): void {
    this.add.emit();
  }

}
