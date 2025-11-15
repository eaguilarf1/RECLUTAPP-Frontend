import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  loading = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  googleClientId = environment.googleClientId;

  ngAfterViewInit(): void {
    const w = window as any;
    if (!this.googleClientId || !w.google || !w.google.accounts || !w.google.accounts.id) {
      return;
    }

    w.google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (resp: any) => this.handleGoogleResponse(resp),
    });

    const btnContainer = document.getElementById('google-btn-login');
    if (btnContainer) {
      w.google.accounts.id.renderButton(btnContainer, {
        type: 'standard',
        theme: 'outline',
        text: 'continue_with',
        shape: 'pill',
        size: 'large',
        width: 320,
      });
    }
  }

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

  private handleGoogleResponse(resp: any) {
    const credential = resp?.credential;
    if (!credential) {
      alert('No se pudo iniciar sesión con Google.');
      return;
    }

    this.loading = true;
    this.auth
      .loginWithGoogle(credential)
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
        error: (e) => {
          console.error(e);
          alert('No se pudo iniciar sesión con Google.');
        },
      });
  }
}
