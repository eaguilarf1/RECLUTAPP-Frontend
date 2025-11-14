import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../../core/services/auth.service';

type SolicitudEstado = 'En revisión' | 'Rechazada' | 'Aceptada';
type Solicitud = { puesto: string; fecha: string; estado: SolicitudEstado };

@Component({
  selector: 'candidate-applications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule],
  templateUrl: './applications.html',
  styleUrls: ['./applications.scss'],
})
export class ApplicationsComponent implements OnInit {
  private auth = inject(AuthService);

  displayedColumns = ['puesto', 'fecha', 'estado'];
  solicitudes: Solicitud[] = [];

  ngOnInit(): void {
    const a: any = this.auth as any;
    let u: any = a?.user;
    if (!u) {
      try {
        u = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {};
      } catch {
        u = {};
      }
    }

    const email = (u.email ?? '').toString();
    const key = 'reclutapp_recommendations';

    let data: any[] = [];
    try {
      data = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }

    const filtered = email
      ? data.filter(x => String(x.email ?? '') === email)
      : data;

    this.solicitudes = filtered.map(x => ({
      puesto: String(x.puesto ?? ''),
      fecha: String(x.fecha ?? ''),
      estado: (x.estado as SolicitudEstado) || 'En revisión',
    }));
  }

  estadoClass(e: SolicitudEstado) {
    return {
      rev: e === 'En revisión',
      rej: e === 'Rechazada',
      ok:  e === 'Aceptada',
    };
  }
}
