import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

@Component({
  selector: 'auth-component',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
})
export default class AuthComponent {
  activeTab: 'login' | 'register' = 'login';

  showTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  onRegisterSubmit() {
    // tu lógica de registro
  }
}
