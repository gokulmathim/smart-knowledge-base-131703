import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq-detail',
  standalone: true,
  template: `
    <h2>FAQ Details</h2>
    <p>FAQ detail for ID: {{ faqId }}</p>
  `
})
export class FaqDetailComponent {
  faqId: string | null = '';
  constructor(route: ActivatedRoute) {
    this.faqId = route.snapshot.paramMap.get('id');
  }
}
