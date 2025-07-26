import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <h2>AI Search</h2>
    <input type="text" placeholder="Search..." class="search-input" />
    <div class="results">
      <!-- Results render here -->
      <p>Search results appear here.</p>
    </div>
  `
})
export class SearchComponent {}
