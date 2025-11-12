import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-recruiter',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './login-recruiter.html',
  styleUrls: ['./login-recruiter.scss'],
})
export class LoginRecruiterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit() {
    if (this.loading || this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role !== 'RECLUTADOR') {
          this.auth.logout();
          alert('Tu cuenta no tiene rol de reclutador.');
          return;
        }
        this.router.navigate(['/reclutador/inicio']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Credenciales inválidas';
        alert(msg);
      }
    });
  }
}
