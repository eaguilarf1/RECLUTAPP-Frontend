import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

type Rol = 'Admin' | 'Reclutador' | 'Candidato';

interface UserRow {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  fecha: string; // dd/MM/yyyy
}

/** Forma tipada del formulario de edición */
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
export class AdminUsersPage {
  private fb = inject(FormBuilder);

  displayedColumns = ['nombre', 'correo', 'rol', 'fecha', 'acciones'];

  data: UserRow[] = [
    { id: '1', nombre: 'Juan Pérez',   correo: 'juan.perez@example.com',       rol: 'Admin',      fecha: '15/08/2025' },
    { id: '2', nombre: 'Ana López',    correo: 'ana.lopez@example.com',        rol: 'Reclutador', fecha: '10/08/2025' },
    { id: '3', nombre: 'Carlos Gómez', correo: 'carlos.gomez@example.com',     rol: 'Candidato',  fecha: '05/08/2025' },
    { id: '4', nombre: 'Laura Martínez', correo: 'laura.martinez@example.com', rol: 'Candidato',  fecha: '01/08/2025' },
  ];

  roles: Rol[] = ['Admin', 'Reclutador', 'Candidato'];

  editingId: string | null = null;

  /** Formulario no-nullable y tipado: evita el error de validators -> Rol */
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

  startEdit(row: UserRow) {
    this.editingId = row.id;
    // Cargamos valores en el formulario (coinciden los tipos)
    this.editForm.setValue({
      nombre: row.nombre,
      correo: row.correo,
      rol: row.rol,
    });
  }

  cancelEdit() {
    this.editingId = null;
    // Restauramos el formulario a un estado válido (no-nullable)
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

    const { nombre, correo, rol } = this.editForm.getRawValue(); // todos son string/Rol
    row.nombre = nombre;
    row.correo = correo;
    row.rol = rol;

    // TODO: PUT /users/:id con row.id y los nuevos datos

    this.cancelEdit();
  }

  delete(row: UserRow) {
    // TODO: confirmar y llamar a la API (DELETE /users/:id)
    this.data = this.data.filter((u) => u.id !== row.id);
  }

  isEditing(row: UserRow) {
    return this.editingId === row.id;
  }
}
