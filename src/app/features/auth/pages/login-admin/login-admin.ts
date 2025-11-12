import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './login-admin.html',
  styleUrls: ['./login-admin.scss'],
})
export class LoginAdminComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit() {
    if (this.loading) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password } = this.form.value;

    this.loading = true;
    this.auth.login(email!, password!)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          const role = this.auth.getRole();
          if (role !== 'ADMIN') {
            alert('Tu cuenta no tiene rol de administrador.');
            this.auth.logout();
            return;
          }
          this.router.navigate(['/admin/inicio']);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Credenciales inválidas';
          alert(msg);
        }
      });
  }
}
