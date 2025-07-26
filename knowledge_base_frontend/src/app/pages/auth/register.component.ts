import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  template: `
    <h2>Register</h2>
    <form>
      <input type="text" placeholder="Email" /><br/>
      <input type="password" placeholder="Password" /><br/>
      <input type="password" placeholder="Confirm Password" /><br/>
      <button type="submit">Register</button>
    </form>
  `
})
export class RegisterComponent {}
