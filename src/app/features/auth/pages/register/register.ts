import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators,
  AbstractControl, ValidationErrors, AbstractControlOptions
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  hidePwd = true;
  hidePwd2 = true;

  emailTakenMsg = '';
  loading = false;

  private formOptions: AbstractControlOptions = {
    validators: RegisterComponent.passwordsMatch,
    updateOn: 'change'
  };

  form = this.fb.group({
    nombre:   ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm:  ['', [Validators.required]]
  }, this.formOptions);

  get f() { return this.form.controls; }

  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pCtrl = group.get('password');
    const cCtrl = group.get('confirm');
    if (!pCtrl || !cCtrl) return null;

    const normalize = (v: any) =>
      (v ?? '')
        .toString()
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim();

    const pass = normalize(pCtrl.value);
    const conf = normalize(cCtrl.value);

    return pass === conf ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid || this.loading) { this.form.markAllAsTouched(); return; }

    this.emailTakenMsg = '';
    this.f.email.setErrors(null);

    const { nombre, email, password } = this.form.getRawValue();
    this.loading = true;

    this.auth.registerCandidate(nombre!, email!, password!).subscribe({
      next: () => {
        this.loading = false;

        this.snack.open('Cuenta creada con éxito', 'OK', { duration: 3000 });
        this.router.navigate(['/candidato/inicio']);
      },
      error: (e) => {
        this.loading = false;

        if (e?.status === 409) {
          this.emailTakenMsg = e?.error?.message ?? 'El correo ya está registrado.';
          this.f.email.setErrors({ emailTaken: true });
          return;
        }

        console.error(e);
        this.form.setErrors({ serverError: true });
        this.snack.open('No se pudo crear la cuenta. Intenta de nuevo.', 'OK', { duration: 3000 });
      }
    });
  }
}
