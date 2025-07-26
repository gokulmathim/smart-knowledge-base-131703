import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiBase = '/api';

  constructor(public http: HttpClient) {
    // Linter: mark http as intentionally unused for DI, all real methods use it
    void http;
  }

  /** PUBLIC_INTERFACE
   * Search knowledge base using AI-powered backend.
   * @param query User query string
   */
  search(query: string): Observable<any> {
    return this.http.post(`${this.apiBase}/ai-search`, { query });
  }

  /** PUBLIC_INTERFACE
   * Get all FAQs.
   */
  getFaqs(): Observable<any> {
    return this.http.get(`${this.apiBase}/faqs`);
  }

  /** PUBLIC_INTERFACE
   * Get single FAQ by ID.
   */
  getFaq(id: number): Observable<any> {
    return this.http.get(`${this.apiBase}/faqs/${id}`);
  }

  /** PUBLIC_INTERFACE
   * Create a FAQ (admin).
   */
  createFaq(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/faqs`, data);
  }

  /** PUBLIC_INTERFACE
   * Update FAQ (admin).
   */
  updateFaq(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBase}/faqs/${id}`, data);
  }

  /** PUBLIC_INTERFACE
   * Delete FAQ (admin).
   */
  deleteFaq(id: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/faqs/${id}`);
  }

  /* Additional stubs for user/auth endpoints can be added here. */
}
