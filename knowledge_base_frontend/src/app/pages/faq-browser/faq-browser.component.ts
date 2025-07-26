import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq-browser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Browse FAQs</h2>
    <input type="text" [(ngModel)]="searchTerm" placeholder="Search FAQs..." (input)="doSearch()" />
    <button *ngIf="isAdmin" (click)="mode='create'">Add FAQ</button>
    <ul>
      <li *ngFor="let faq of filteredFaqs">
        <strong (click)="viewFaq(faq.id)" style="cursor:pointer;">{{faq.title}}</strong>
        <span *ngIf="faq.category" style="color:gray;"> [{{faq.category}}]</span>
        <span *ngIf="isAdmin">
          <button (click)="editFaq(faq)">Edit</button>
          <button (click)="deleteFaq(faq.id)">Delete</button>
        </span>
      </li>
    </ul>
    <div *ngIf="mode==='edit' || mode==='create'">
      <h3>{{mode==='edit' ? 'Edit FAQ' : 'Create FAQ'}}</h3>
      <form (ngSubmit)="saveFaq()">
        <label>Title: <input [(ngModel)]="editFaqData.title" name="title" required></label><br>
        <label>Category: <input [(ngModel)]="editFaqData.category" name="category"></label><br>
        <textarea [(ngModel)]="editFaqData.answer" name="answer" rows="4" required placeholder="Answer"></textarea><br>
        <button type="submit">Save</button>
        <button type="button" (click)="mode=''">Cancel</button>
      </form>
    </div>
  `
})
export class FaqBrowserComponent {
  faqs: any[] = [];
  filteredFaqs: any[] = [];
  editFaqData: any = {};
  mode: ''|'edit'|'create' = '';
  isAdmin = false;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.refresh();
    this.authService.user$.subscribe(u => this.isAdmin = !!u?.isAdmin);
    this.route.queryParams.subscribe(params => {
      this.applyFilter(params['category']);
    });
  }

  refresh() {
    this.apiService.getFaqs().subscribe(res => {
      if (Array.isArray(res)) { this.faqs = res; this.applyFilter(); }
    });
  }
  applyFilter(category?: string) {
    const cat = category || this.route.snapshot.queryParams['category'];
    this.filteredFaqs = this.faqs.filter(f=>!cat||cat==='All'||f.category===cat);
    this.doSearch();
  }
  doSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFaqs = this.faqs.filter(f=>
      (!this.route.snapshot.queryParams['category'] || this.route.snapshot.queryParams['category']=='All' || f.category==this.route.snapshot.queryParams['category']) &&
      (!this.searchTerm ||
        f.title?.toLowerCase().includes(term) ||
        f.answer?.toLowerCase().includes(term)
      )
    );
  }
  viewFaq(id: number) {
    if (typeof globalThis !== 'undefined' && globalThis.location) {
      globalThis.location.href = '/faq/' + id;
    }
  }
  editFaq(faq: any) {
    this.mode = 'edit';
    this.editFaqData = { ...faq };
  }
  deleteFaq(id: number) {
    if (typeof globalThis !== 'undefined' && globalThis.confirm && globalThis.confirm('Delete this FAQ?')) {
      this.apiService.deleteFaq(id).subscribe(() => this.refresh());
    }
  }
  saveFaq() {
    if (this.mode === 'edit') {
      this.apiService.updateFaq(this.editFaqData.id, this.editFaqData).subscribe(() => { this.mode = ''; this.refresh(); });
    } else {
      this.apiService.createFaq(this.editFaqData).subscribe(() => { this.mode = ''; this.refresh(); });
    }
  }
}
