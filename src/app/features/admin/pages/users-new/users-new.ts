import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-user-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './users-new.html',
  styleUrls: ['./users-new.scss'],
})
export class AdminUserNewComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  roles = ['Admin', 'Reclutador', 'Candidato'];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    rol: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
  }, { validators: this.passwordsMatch });

  private passwordsMatch(group: any) {
    const p = group.get('password')?.value;
    const c = group.get('confirm')?.value;
    return p && c && p !== c ? { mismatch: true } : null;
  }

  get f() { return this.form.controls; }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Nuevo usuario (mock):', this.form.value);

    this.router.navigate(['/admin/usuarios']);
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
