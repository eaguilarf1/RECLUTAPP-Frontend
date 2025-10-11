import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

type SolicitudEstado = 'En revisión' | 'Rechazada' | 'Aceptada';
type Solicitud = { puesto: string; fecha: string; estado: SolicitudEstado };

@Component({
  selector: 'candidate-applications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule],
  templateUrl: './applications.html',
  styleUrls: ['./applications.scss'],
})
export class ApplicationsComponent {
  displayedColumns = ['puesto', 'fecha', 'estado'];

  solicitudes: Solicitud[] = [
    { puesto: 'Analista de datos',     fecha: '15/08/2025', estado: 'En revisión' },
    { puesto: 'Ingeniero de software', fecha: '10/08/2025', estado: 'Rechazada'  },
  ];

  estadoClass(e: SolicitudEstado) {
    return {
      rev: e === 'En revisión',
      rej: e === 'Rechazada',
      ok:  e === 'Aceptada',
    };
  }
}
