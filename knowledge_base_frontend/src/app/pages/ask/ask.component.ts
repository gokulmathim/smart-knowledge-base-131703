import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ask',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>Ask a Question</h2>
    <form (ngSubmit)="submit()">
      <textarea rows="4" cols="48" placeholder="Type your question..." [(ngModel)]="question" name="question"></textarea>
      <br/>
      <button type="submit">Submit</button>
    </form>
    <div *ngIf="msg" style="color:green">{{msg}}</div>
  `
})
export class AskComponent {
  question = '';
  msg = '';
  constructor() {}
  submit() {
    ApiService.prototype.search(this.question).subscribe(
      () => this.msg = 'Question submitted! (AI search result returned in /search, not here.)'
    );
  }
}
