import { Component } from '@angular/core';

@Component({
  selector: 'app-ask',
  standalone: true,
  template: `
    <h2>Ask a Question</h2>
    <form>
      <textarea rows="4" cols="48" placeholder="Type your question..."></textarea>
      <br/>
      <button type="submit">Submit</button>
    </form>
  `
})
export class AskComponent {}
