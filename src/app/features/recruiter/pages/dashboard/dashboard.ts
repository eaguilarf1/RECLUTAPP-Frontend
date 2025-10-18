import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

type Vacante = { puesto: string; fecha: string; estado: 'Abierta'|'Cerrada' };

@Component({
  selector: 'recruiter-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class RecruiterDashboardComponent {
   constructor(private router: Router) {}
  displayedColumns = ['puesto','fecha','estado'];
  vacantes: Vacante[] = [
    { puesto: 'Analista de datos',     fecha: '15/08/2025', estado: 'Abierta' },
    { puesto: 'Ingeniero de software', fecha: '10/08/2025', estado: 'Cerrada' },
  ];

  crearVacante() { this.router.navigate(['/reclutador/crear-vacante']); }
  buscarPerfiles() {}
}
