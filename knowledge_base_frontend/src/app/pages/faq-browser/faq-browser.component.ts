import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  private _apiService: ApiService;
  private _authService: AuthService;
  private _route: ActivatedRoute;
  private _router: Router;

  constructor(
    apiService: ApiService,
    authService: AuthService,
    route: ActivatedRoute,
    router: Router
  ) {
    this._apiService = apiService;
    this._authService = authService;
    this._route = route;
    this._router = router;
    this.refresh();
    this._authService.user$.subscribe(u => this.isAdmin = !!u?.isAdmin);
    // Trigger filtering on route change
    this._route.queryParams.subscribe(params => {
      this.applyFilter(params['category']);
    });
  }

  refresh() {
    this._apiService.getFaqs().subscribe((res: any) => {
      if (Array.isArray(res)) { this.faqs = res; this.applyFilter(); }
    });
  }
  applyFilter(category?: string) {
    const cat = category || this._route.snapshot.queryParams['category'];
    this.filteredFaqs = this.faqs.filter(f=>!cat||cat==='All'||f.category===cat);
    this.doSearch(cat ?? undefined);
  }
  doSearch(categoryOverride?: string) {
    const term = this.searchTerm.toLowerCase();
    let cat = categoryOverride ?? this._route.snapshot.queryParams['category'];
    this.filteredFaqs = this.faqs.filter(f=>
      (!cat || cat==='All' || f.category==cat) &&
      (!this.searchTerm ||
        f.title?.toLowerCase().includes(term) ||
        f.answer?.toLowerCase().includes(term)
      )
    );
  }
  viewFaq(id: number) {
    this._router.navigate(['/faq', id]);
  }
  editFaq(faq: any) {
    this.mode = 'edit';
    this.editFaqData = { ...faq };
  }
  deleteFaq(id: number) {
    if (typeof globalThis !== 'undefined' && globalThis.confirm && globalThis.confirm('Delete this FAQ?')) {
      this._apiService.deleteFaq(id).subscribe(() => this.refresh());
    }
  }
  saveFaq() {
    if (this.mode === 'edit') {
      this._apiService.updateFaq(this.editFaqData.id, this.editFaqData).subscribe(() => { this.mode = ''; this.refresh(); });
    } else {
      this._apiService.createFaq(this.editFaqData).subscribe(() => { this.mode = ''; this.refresh(); });
    }
  }
}
