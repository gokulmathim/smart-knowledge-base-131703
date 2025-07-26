import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>AI Search</h2>
    <input type="text" placeholder="Search..." class="search-input" [(ngModel)]="q" (keyup.enter)="doSearch()" />
    <button (click)="doSearch()">Search</button>
    <div class="results">
      <div *ngIf="loading">Searching...</div>
      <div *ngIf="results && results.length">
        <ul>
          <li *ngFor="let r of results">
            <strong>{{r.title}}</strong><br>
            <span>{{r.snippet}}</span>
          </li>
        </ul>
      </div>
      <div *ngIf="results && !results.length && !loading">No results.</div>
    </div>
  `
})
export class SearchComponent {
  q = '';
  loading = false;
  results: any[] = [];
  constructor(apiService: ApiService) {
    this._apiService = apiService;
  }
  private _apiService: ApiService;
  doSearch() {
    if (!this.q) return;
    this.loading = true;
    this._apiService.search(this.q).subscribe(
      res => {
        this.loading = false;
        this.results = res?.results || [];
      },
      () => { this.loading = false; this.results = []; }
    );
  }
}
