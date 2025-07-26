import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <h2>Login</h2>
    <form>
      <input type="text" placeholder="Email" /><br/>
      <input type="password" placeholder="Password" /><br/>
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {}
