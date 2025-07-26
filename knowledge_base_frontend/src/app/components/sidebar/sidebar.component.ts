import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './sidebar.component.css',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  categories: string[] = [];
  selected: string = 'All';

  constructor(api: ApiService) {
    api.getFaqs().subscribe(res => {
      if (Array.isArray(res)) {
        const cats = new Set<string>();
        res.forEach(faq => (faq.category ? cats.add(faq.category) : null));
        this.categories = Array.from(cats);
      }
    });
  }

  filterBy(cat: string) {
    this.selected = cat;
    if (typeof globalThis !== 'undefined' && globalThis.location) {
      globalThis.location.pathname = '/faq';
      if (cat !== 'All') {
        globalThis.location.search = `?category=${encodeURIComponent(cat)}`;
      } else {
        globalThis.location.search = '';
      }
    }
  }
}

