import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';

type Rol = 'Admin' | 'Reclutador' | 'Candidato';

interface UserRow {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  fecha: string;
}

interface EditForm {
  nombre: FormControl<string>;
  correo: FormControl<string>;
  rol: FormControl<Rol>;
}

@Component({
  selector: 'admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class AdminUsersPage implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  displayedColumns = ['nombre', 'correo', 'rol', 'fecha', 'acciones'];

  data: UserRow[] = [];

  roles: Rol[] = ['Admin', 'Reclutador', 'Candidato'];

  editingId: string | null = null;

  editForm: FormGroup<EditForm> = this.fb.group<EditForm>({
    nombre: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    correo: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    rol: this.fb.nonNullable.control<Rol>('Candidato', [Validators.required]),
  });

  ngOnInit(): void {
    this.load();
  }

  private toUiRole(domain: any): Rol {
    const s = (domain ?? '').toString().toLowerCase();
    if (s.startsWith('admin') || domain === 0 || domain === '0') return 'Admin';
    if (s.startsWith('recru') || domain === 1 || domain === '1') return 'Reclutador';
    return 'Candidato';
  }

  private toDomainRole(ui: Rol): 'Admin' | 'Recruiter' | 'Candidate' {
    if (ui === 'Admin') return 'Admin';
    if (ui === 'Reclutador') return 'Recruiter';
    return 'Candidate';
  }

  private fmtDate(d: string | Date): string {
    const dd = new Date(d);
    const day = String(dd.getDate()).padStart(2, '0');
    const mon = String(dd.getMonth() + 1).padStart(2, '0');
    const yr = dd.getFullYear();
    return `${day}/${mon}/${yr}`;
  }

  load() {
    this.auth.adminListUsers(1, 50).subscribe({
      next: (res: any) => {
        const items = res?.items ?? [];
        this.data = items.map((u: any) => ({
          id: u.id,
          nombre: u.name,
          correo: u.email,
          rol: this.toUiRole(u.role),
          fecha: this.fmtDate(u.createdAt),
        }));
      },
      error: () => {},
    });
  }

  startEdit(row: UserRow) {
    this.editingId = row.id;
    this.editForm.setValue({
      nombre: row.nombre,
      correo: row.correo,
      rol: row.rol,
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm.reset({
      nombre: '',
      correo: '',
      rol: 'Candidato',
    });
  }

  saveEdit(row: UserRow) {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const { nombre, correo, rol } = this.editForm.getRawValue();
    this.auth
      .adminUpdateUser(row.id, {
        name: nombre,
        email: correo,
        role: this.toDomainRole(rol),
      })
      .subscribe({
        next: () => {
          row.nombre = nombre;
          row.correo = correo;
          row.rol = rol;
          this.cancelEdit();
        },
        error: (e) => {
          alert(e?.error?.message || 'No se pudo actualizar el usuario.');
        },
      });
  }

  delete(row: UserRow) {
    if (!confirm(`¿Eliminar a ${row.nombre}?`)) return;
    this.auth.adminDeleteUser(row.id).subscribe({
      next: () => {
        this.data = this.data.filter((u) => u.id !== row.id);
      },
      error: (e) => {
        alert(e?.error?.message || 'No se pudo eliminar el usuario.');
      },
    });
  }

  isEditing(row: UserRow) {
    return this.editingId === row.id;
  }
}
