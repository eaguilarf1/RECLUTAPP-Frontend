import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

type Solicitud = { puesto: string; fecha: string; estado: 'En revisión' | 'Rechazada' | 'Aceptada' };

@Component({
  selector: 'candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  cvNombre = 'curriculum.pdf';
  sugerida = { puesto: 'Desarrollador Frontend', ciudad: 'Ciudad de Guatemala', fecha: '01/09/2025' };

  displayedColumns = ['puesto', 'fecha', 'estado'];
  solicitudes: Solicitud[] = [
    { puesto: 'Analista de datos',     fecha: '15/08/2025', estado: 'En revisión' },
    { puesto: 'Ingeniero de software', fecha: '10/08/2025', estado: 'Rechazada'  },
  ];
}

