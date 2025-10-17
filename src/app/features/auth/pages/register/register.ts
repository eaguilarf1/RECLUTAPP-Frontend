import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  hidePwd = true;
  hidePwd2 = true;

  private readonly GT_PHONE = /^(?:\+502\s?)?(?:\d{4}[-\s]?\d{4})$/;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(this.GT_PHONE)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', [Validators.required]],
    profesion: ['', [Validators.required]],
    experiencia: [null as number | null, [Validators.required, Validators.min(0)]],
  }, {
    validators: (group) => {
      const p = group.get('password')?.value;
      const c = group.get('confirmar')?.value;
      return p && c && p !== c ? { mismatch: true } : null;
    },
  });

  get f(): { [k: string]: AbstractControl } { return this.form.controls; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Registro (mock Guatemala):', this.form.value);

    alert('Cuenta creada (mock). Ahora puedes iniciar sesión.');
    this.router.navigate(['/auth/login']);
  }
}
