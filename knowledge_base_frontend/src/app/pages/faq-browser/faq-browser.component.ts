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
    <section aria-label="FAQ Browser">
      <h2 style="margin-bottom:1.2rem;">Browse FAQs</h2>
      <div style="display:flex; gap:0.8rem; align-items:center; margin-bottom:1rem;">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Search FAQs..."
          (input)="doSearch()"
          aria-label="Search FAQs"
          style="padding:0.45em 1em; border-radius:0.32rem; border:1px solid #ddd; flex:1;"
        />
        <button
          *ngIf="isAdmin"
          (click)="mode='create'"
          aria-label="Add a new FAQ"
          style="background:#ffca28; color:#222; border:none; font-weight:600; border-radius:0.35rem; padding:0.4em 1.1em; cursor:pointer;"
        >Add FAQ</button>
      </div>
      <ul style="margin-top:1.1rem; margin-bottom:1.7rem; padding-left:0;">
        <li *ngFor="let faq of filteredFaqs" style="margin-bottom:0.9rem;list-style:none;">
          <strong
            (click)="viewFaq(faq.id)"
            tabindex="0"
            style="cursor:pointer; font-size:1.05em; color:#1976d2;"
            role="link"
            [attr.aria-label]="'View FAQ: ' + faq.title"
            (keyup.enter)="viewFaq(faq.id)"
          >{{faq.title}}</strong>
          <span *ngIf="faq.category" style="color:gray;"> [{{faq.category}}]</span>
          <span *ngIf="isAdmin" style="margin-left:1rem;">
            <button
              (click)="editFaq(faq)"
              aria-label="Edit this FAQ"
              title="Edit"
              style="margin-right:0.18em; border-radius:0.29em; border:none; background:#daeaff; color:#222; padding:0.23em 0.9em; font-size:inherit; cursor:pointer;"
              >Edit</button>
            <button
              (click)="deleteFaq(faq.id)"
              aria-label="Delete this FAQ"
              title="Delete"
              style="border-radius:0.29em; border:none; background:#ffdfe0; color:#880018; padding:0.23em 0.9em; font-size:inherit; cursor:pointer;"
              >Delete</button>
          </span>
        </li>
      </ul>
      <div *ngIf="mode==='edit' || mode==='create'" style="margin-top:2.2rem;">
        <h3 style="margin-bottom:1.2em;">{{mode==='edit' ? 'Edit FAQ' : 'Create FAQ'}}</h3>
        <form (ngSubmit)="saveFaq()" autocomplete="off">
          <label for="faq-title">Title:</label>
          <input [(ngModel)]="editFaqData.title" id="faq-title" name="title" required style="margin-bottom:0.6em;width:60%;"><br>
          <label for="faq-cat">Category:</label>
          <input [(ngModel)]="editFaqData.category" id="faq-cat" name="category" style="margin-bottom:0.6em;width:50%;"><br>
          <label for="faq-answer">Answer:</label><br>
          <textarea [(ngModel)]="editFaqData.answer" id="faq-answer" name="answer" rows="4" required placeholder="Answer" style="width:90%;"></textarea><br>
          <button type="submit" style="background:#1976d2; color:#fff; font-weight:600; padding:0.28em 1.1em; border:none; border-radius:0.32rem; margin-right:0.8em;">Save</button>
          <button type="button" (click)="mode=''" style="background:#f0f3f9; color:#1976d2; border:none; border-radius:0.32rem; padding:0.28em 1.1em;">Cancel</button>
        </form>
      </div>
    </section>
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
