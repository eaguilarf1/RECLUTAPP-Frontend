import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';

type Role = 'Recruiter' | 'Admin' | 'Candidate';

@Component({
  selector: 'admin-user-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './users-new.html',
  styleUrls: ['./users-new.scss'],
})
export class AdminUserNewComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  roles: Array<{ value: Role; label: string }> = [
    { value: 'Recruiter', label: 'Reclutador' },
    { value: 'Admin',     label: 'Administrador' },
    { value: 'Candidate', label: 'Candidato' }
  ];

  form = this.fb.nonNullable.group({
    nombre:  ['', [Validators.required, Validators.minLength(3)]],
    email:   ['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
    role:    this.fb.nonNullable.control<Role>('Recruiter', { validators: Validators.required })
  }, { validators: AdminUserNewComponent.passwordsMatch });

  get f() { return this.form.controls; }

  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value ?? '';
    const conf = group.get('confirm')?.value ?? '';
    return pass === conf ? null : { passwordMismatch: true };
  }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, email, password, role } = this.form.getRawValue();
    this.auth.adminCreateUser(nombre, email, password, role).subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: () => {}
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
