import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'candidate-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  // nombre del archivo cargado (opcional, por si luego quieres mostrarlo)
  cvFileName: string | null = null;

  form = this.fb.group({
    nombre: ['Edward Aguilar', [Validators.required, Validators.minLength(3)]],
    email: ['edwardaguilar@example.com', [Validators.required, Validators.email]],
    telefono: ['+502 2460 0000', [Validators.required]],
    ubicacion: ['Ciudad de Guatemala', [Validators.required]],
    profesion: ['Desarrollador Frontend', [Validators.required]],
    experiencia: [3, [Validators.required, Validators.min(0)]],
  });

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Perfil guardado:', this.form.value);
    alert('Perfil actualizado (mock).');
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

  // === Nuevo: manejo de “Adjuntar curriculum” ===
  onCvSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) { return; }

    // Validaciones básicas en cliente: solo PDF, tamaño <= 5 MB
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const maxBytes = 5 * 1024 * 1024; // 5 MB

    if (!isPdf) {
      alert('Solo se permiten archivos PDF.');
      input.value = '';
      return;
    }
    if (file.size > maxBytes) {
      alert('El archivo supera el tamaño máximo permitido (5 MB).');
      input.value = '';
      return;
    }

    this.cvFileName = file.name;
    // Aquí en el futuro llamarás a tu servicio para subir el PDF al backend:
    // this.perfilService.subirCv(file).subscribe(...)
    console.log('CV seleccionado:', file.name, file.type, file.size);
    alert('Curriculum adjuntado (mock): ' + file.name);
  }
}

@Component({
  selector: 'change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
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

    console.log('Cambiar contraseña (mock):', this.pwdForm.value);
    alert('Contraseña actualizada (mock).');
    this.cerrar();
  }

  cerrar() { this.dialog.closeAll(); }
}
