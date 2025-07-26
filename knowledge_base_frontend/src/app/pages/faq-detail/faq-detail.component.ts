import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.faqId = +(this.route.snapshot.paramMap.get('id') || '0');
    this.apiService.getFaq(this.faqId).subscribe(res => this.faq = res);
    this.authService.user$.subscribe(u => this.isAdmin = !!u?.isAdmin);
  }

  saveFaq() {
    this.apiService.updateFaq(this.faq.id, this.faq).subscribe(() => this.editMode = false);
  }
  deleteFaq() {
    if (typeof globalThis !== 'undefined' && globalThis.confirm && globalThis.confirm('Delete this FAQ?')) {
      this.apiService.deleteFaq(this.faq.id).subscribe(() => {
        if (typeof globalThis !== 'undefined' && globalThis.location) {
          globalThis.location.href = '/faq';
        }
      });
    }
  }
}
