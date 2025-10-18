import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';          // <-- para [(ngModel)]
import { RouterModule } from '@angular/router';        // <-- para routerLink
import { MatIconModule } from '@angular/material/icon';// <-- para <mat-icon>

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  // Propiedades enlazadas con [(ngModel)]
  email = '';
  password = '';

  // Handler del submit (por ahora sólo loguea; sin redirecciones)
  login() {
    console.log('Intento de login:', { email: this.email, password: this.password });
    // Aquí iría la llamada a tu servicio de autenticación.
  }
}
