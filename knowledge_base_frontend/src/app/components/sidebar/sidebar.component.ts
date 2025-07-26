import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(api: ApiService, router: Router) {
    api.getFaqs().subscribe(res => {
      if (Array.isArray(res)) {
        const cats = new Set<string>();
        res.forEach(faq => (faq.category ? cats.add(faq.category) : null));
        this.categories = Array.from(cats);
      }
    });
    this._router = router;
  }
  private _router: Router;
  ngOnInit(): void {
    // NOTE: Avoid window for SSR; can initialize selection by query parameters using Router!
  }



  filterBy(cat: string) {
    this.selected = cat;
    if (cat !== 'All') {
      this._router.navigate(['/faq'], { queryParams: { category: cat } });
    } else {
      this._router.navigate(['/faq']);
    }
  }
}
