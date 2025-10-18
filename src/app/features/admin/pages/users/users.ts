import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

type AdminUser = {
  nombre: string;
  email: string;
  rol: 'Admin' | 'Reclutador' | 'Candidato';
  fecha: string; 
};

@Component({
  selector: 'admin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class AdminUsersComponent {

  data: AdminUser[] = [
    { nombre: 'Juan Pérez',   email: 'juan.perez@example.com',   rol: 'Admin',      fecha: '15/08/2025' },
    { nombre: 'Ana López',    email: 'ana.lopez@example.com',    rol: 'Reclutador', fecha: '10/08/2025' },
    { nombre: 'Carlos Gómez', email: 'carlos.gomez@example.com', rol: 'Candidato',  fecha: '05/08/2025' },
    { nombre: 'Laura Martínez', email: 'laura.martinez@example.com', rol: 'Candidato', fecha: '01/08/2025' },
  ];

  displayed = ['nombre', 'email', 'rol', 'fecha'];

  constructor(private router: Router) {}
  goNew() {
    this.router.navigate(['/admin/usuarios/nuevo']);
  }
}
