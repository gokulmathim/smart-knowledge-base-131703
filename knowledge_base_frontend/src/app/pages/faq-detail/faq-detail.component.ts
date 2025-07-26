/* global setTimeout */
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import jsPDF via dynamic import, as Angular SSR environments may not have window.
// We'll use a button UI enhancement as well.
@Component({
  selector: 'app-faq-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>FAQ Details</h2>
    <div *ngIf="faq">
      <h3>{{faq.title}}</h3>
      <span *ngIf="faq.category" style="color:gray;">[{{faq.category}}]</span>
      <p>{{faq.answer}}</p>
      <div style="display: flex; gap: 0.5em; align-items: center; margin-bottom: 1em;">
        <button (click)="exportPdf()" style="background:#1976d2;color:white;border:none;padding:0.5em 1em;border-radius:4px;font-weight:500;cursor:pointer;">
          <span style="vertical-align:middle;">&#128196;</span> Export PDF
        </button>
        <span *ngIf="pdfSuccess" style="color:green;font-size:0.95em;">PDF downloaded!</span>
      </div>
      <span *ngIf="isAdmin">
        <button (click)="editMode=true">Edit</button>
        <button (click)="deleteFaq()">Delete</button>
      </span>
    </div>
    <div *ngIf="editMode">
      <form (ngSubmit)="saveFaq()">
        <input [(ngModel)]="faq.title" name="title" required />
        <input [(ngModel)]="faq.category" name="category" />
        <textarea [(ngModel)]="faq.answer" name="answer" rows="4" required></textarea>
        <button type="submit">Save</button>
        <button type="button" (click)="editMode=false">Cancel</button>
      </form>
    </div>
  `
})
export class FaqDetailComponent {
  faqId: number = 0;
  faq: any = null;
  editMode = false;
  isAdmin = false;
  pdfSuccess = false;

  constructor(
    route: ActivatedRoute,
    apiService: ApiService,
    authService: AuthService
  ) {
    this._route = route;
    this._apiService = apiService;
    this._authService = authService;
    this.faqId = +(this._route.snapshot.paramMap.get('id') || '0');
    this._apiService.getFaq(this.faqId).subscribe(res => this.faq = res);
    this._authService.user$.subscribe(u => this.isAdmin = !!u?.isAdmin);
  }
  private _route: ActivatedRoute;
  private _apiService: ApiService;
  private _authService: AuthService;

  saveFaq() {
    this._apiService.updateFaq(this.faq.id, this.faq).subscribe(() => this.editMode = false);
  }
  deleteFaq() {
    if (typeof globalThis !== 'undefined' && globalThis.confirm && globalThis.confirm('Delete this FAQ?')) {
      this._apiService.deleteFaq(this.faq.id).subscribe(() => {
        if (typeof globalThis !== 'undefined' && globalThis.location) {
          globalThis.location.href = '/faq';
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  async exportPdf() {
    // Runs in the browser; SSR safe check.
    if (typeof globalThis === 'undefined' || !this.faq) return;
    // Dynamic import for SSR compatibility
    const jsPDF = (await import('jspdf')).jsPDF;
    const doc = new jsPDF();

    // Title Styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(this.faq.title || 'FAQ', 15, 25);
    // Category
    let y = 35;
    if (this.faq.category) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`[${this.faq.category}]`, 15, y);
      y += 10;
    }
    // Answer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50);
    // Wrap text lines nicely, max width = 180, line spacing = 8
    const lines: string[] = doc.splitTextToSize(this.faq.answer || '', 180);
    doc.text(lines, 15, y);

    const filename = (this.faq.title ? this.faq.title.replace(/[^\w]/g, "_") : "faq") + '.pdf';
    doc.save(filename);

    // UI feedback
    this.pdfSuccess = true;
    setTimeout(() => (this.pdfSuccess = false), 1200);
  }
}
