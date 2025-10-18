import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';

type Row = { nombre: string; rol: 'Candidato'|'Reclutador'|'Administrador'; fecha: string };

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatDividerModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class AdminDashboardComponent {
  resumen = { vacantesActivas: 3, totalUsuarios: 5 };

  displayed = ['nombre','rol','fecha'];
  recientes: Row[] = [
    { nombre:'Ana López',   rol:'Candidato',    fecha:'15/08/2025' },
    { nombre:'Juan Pérez',  rol:'Reclutador',   fecha:'10/08/2025' },
    { nombre:'María Gómez', rol:'Candidato',    fecha:'05/08/2025' },
  ];
}
