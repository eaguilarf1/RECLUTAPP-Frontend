import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'candidate-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, HttpClientModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private cvNameKey!: string;
  private cvDataKey!: string;

  cvFileName: string | null = null;
  cvUrl: string | null = null;
  cvData: string | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['+502 2460 0000', [Validators.required]]
  });

  constructor() {
    const u: any = this.auth.user ?? {};
    const id = (u.id ?? u.userId ?? u.userID ?? '').toString();
    const email = (u.email ?? '').toString();
    const keyBase = id ? `cv_${id}` : (email ? `cv_${email}` : 'cv_default');

    this.cvNameKey = `${keyBase}_name`;
    this.cvDataKey = `${keyBase}_data`;

    this.cvFileName = localStorage.getItem(this.cvNameKey) ?? null;
    this.cvData = localStorage.getItem(this.cvDataKey) ?? null;

    if (this.cvData) {
      const blob = this.base64ToBlob(this.cvData, 'application/pdf');
      this.cvUrl = URL.createObjectURL(blob);
    }

    this.form.patchValue({
      nombre: (u.name ?? u.nombre ?? '').toString().trim(),
      email: email.trim(),
      telefono: (u.phone ?? u.telefono ?? this.form.value.telefono) as string
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      name: (this.f['nombre'].value as string).trim(),
      email: (this.f['email'].value as string).trim()
    };

    const base = (environment.api || '').toString().replace(/\/+$/, '');
    const url = `${base}/me`;

    this.http.put(url, payload).subscribe({
      next: () => {
        try {
          const u: any = (this.auth as any).user ?? {};
          u.name = payload.name;
          u.email = payload.email;
          u.phone = (this.f['telefono'].value as string).trim();

          const a: any = this.auth as any;
          if (typeof a.setUser === 'function') a.setUser(u);
          if (a.user$?.next) a.user$.next(u);
          a.user = u;

          localStorage.setItem('user', JSON.stringify(u));
        } catch {}

        localStorage.setItem('candidate_phone', (this.f['telefono'].value as string));
        alert('Perfil actualizado.');
      },
      error: (e) => {
        const msg =
          e?.error?.message ||
          e?.error?.title ||
          e?.message ||
          'No se pudo actualizar el perfil.';
        alert(`${msg}${e?.status ? ' (HTTP ' + e.status + ')' : ''}`);
        console.error('PUT', url, 'failed:', e);
      }
    });
  }

  abrirCambiarPassword() {
    this.dialog.open(ChangePasswordDialog, {
      width: 'min(480px, 90vw)',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
      panelClass: 'pwd-dialog',
    });
  }

  onCvSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const maxBytes = 5 * 1024 * 1024;
    if (!isPdf) { alert('Solo se permiten archivos PDF.'); input.value = ''; return; }
    if (file.size > maxBytes) { alert('El archivo supera el tamaño máximo permitido (5 MB).'); input.value = ''; return; }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';

      if (this.cvUrl) URL.revokeObjectURL(this.cvUrl);
      const blob = this.base64ToBlob(base64, 'application/pdf');
      this.cvUrl = URL.createObjectURL(blob);

      this.cvFileName = file.name;
      this.cvData = base64;

      localStorage.setItem(this.cvNameKey, this.cvFileName);
      localStorage.setItem(this.cvDataKey, base64);

      alert('Curriculum adjuntado (mock): ' + file.name);
    };
    reader.readAsDataURL(file);
  }

  viewCv() {
    if (this.cvUrl) window.open(this.cvUrl, '_blank');
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const byteString = atob(base64);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
    return new Blob([bytes], { type });
  }
}

@Component({
  selector: 'change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Cambiar contraseña</h2>

    <form [formGroup]="pwdForm" (ngSubmit)="cambiar()">
      <mat-dialog-content class="dialog-content">
        <mat-form-field appearance="outline" class="field">
          <mat-label>Contraseña actual</mat-label>
          <input matInput type="password" formControlName="actual" autocomplete="current-password" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Nueva contraseña</mat-label>
          <input matInput type="password" formControlName="nueva" autocomplete="new-password" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Confirmar nueva contraseña</mat-label>
          <input matInput type="password" formControlName="confirmacion" autocomplete="new-password" />
          <mat-hint *ngIf="pwdForm.hasError('mismatch') && pwdForm.touched" style="color:#b91c1c">
            Las contraseñas no coinciden.
          </mat-hint>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cerrar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit">Actualizar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content { display: grid; gap: 12px; }
    .field { width: 100%; }
  `]
})
export class ChangePasswordDialog {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);

  pwdForm = this.fb.group({
    actual: ['', [Validators.required]],
    nueva: ['', [Validators.required, Validators.minLength(6)]],
    confirmacion: ['', [Validators.required]],
  }, {
    validators: (group) => {
      const n = group.get('nueva')?.value;
      const c = group.get('confirmacion')?.value;
      return n && c && n !== c ? { mismatch: true } : null;
    }
  });

  cambiar() {
    if (this.pwdForm.invalid) { this.pwdForm.markAllAsTouched(); return; }

    const base = (environment.api || '').toString().replace(/\/+$/, '');
    const url = `${base}/me/password`;

    const payload = {
      currentPassword: (this.pwdForm.value.actual ?? '').toString().trim(),
      newPassword: (this.pwdForm.value.nueva ?? '').toString().trim(),
    };

    this.http.put(url, payload).subscribe({
      next: () => {
        alert('Contraseña actualizada.');
        this.cerrar();
      },
      error: (e) => {
        const msg =
          e?.error?.message ||
          e?.error?.title ||
          e?.message ||
          'No se pudo actualizar la contraseña.';
        alert(`${msg}${e?.status ? ' (HTTP ' + e.status + ')' : ''}`);
        console.error('PUT', url, 'failed:', e);
      }
    });
  }

  cerrar() { this.dialog.closeAll(); }
}
