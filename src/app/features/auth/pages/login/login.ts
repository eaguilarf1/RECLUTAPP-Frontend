import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  private auth = inject(AuthService);
  private router = inject(Router);

  login() {
    if (this.loading) return;
    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) return;

    this.loading = true;
    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          const role = this.auth.getRole();
          if (role !== 'CANDIDATO') {
            const nextLogin = role === 'ADMIN' ? '/auth/login-admin' : '/auth/login-reclutador';
            alert('Este acceso es solo para candidatos. Usa tu acceso correspondiente.');
            this.auth.logout();
            this.router.navigateByUrl(nextLogin);
            return;
          }
          this.router.navigateByUrl('/candidato/inicio');
        },
        error: (err) => {
          const msg = err?.error?.message || 'Credenciales inválidas';
          alert(msg);
        },
      });
  }
}
