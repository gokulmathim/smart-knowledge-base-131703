import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Admin Dashboard</h2>
    <p>Manage FAQs and moderate questions.</p>
    <ul>
      <li *ngFor="let faq of faqs">
        <strong>{{faq.title}}</strong>
        <button (click)="deleteFaq(faq.id)">Delete</button>
      </li>
    </ul>
  `
})
export class AdminDashboardComponent {
  faqs: any[] = [];
  constructor(apiService: ApiService) {
    this._apiService = apiService;
    this.refresh();
  }
  private _apiService: ApiService;
  refresh() {
    this._apiService.getFaqs().subscribe(res => this.faqs = res || []);
  }
  deleteFaq(id: number) {
    if (typeof globalThis !== 'undefined' && globalThis.confirm && globalThis.confirm('Delete FAQ?')) {
      this._apiService.deleteFaq(id).subscribe(() => {
        this.refresh();
      });
    }
  }
}
