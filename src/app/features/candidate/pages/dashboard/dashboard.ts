import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { VacanciesService } from '../../../../core/services/vacancies.service';

type SolicitudEstado = 'En revisión' | 'Rechazada' | 'Aceptada';

type Solicitud = {
  puesto: string;
  fecha: string;
  estado: SolicitudEstado;
};

type Sugerida = {
  id: string;
  puesto: string;
  ciudad: string;
  fecha: string;
};

@Component({
  selector: 'candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private vacanciesSvc = inject(VacanciesService);
  private router = inject(Router);

  displayName = 'Usuario';

  cvNombre: string | null = null;
  hasCv = false;

  sugerida: Sugerida | null = null;

  displayedColumns = ['puesto', 'fecha', 'estado'];
  solicitudes: Solicitud[] = [];

  constructor() {
    const u: any =
      this.auth.user ??
      (() => {
        try {
          return JSON.parse(localStorage.getItem('user') ?? 'null') ?? {};
        } catch {
          return {};
        }
      })();

    const full = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
    const name = u.name ?? u.nombre ?? u.fullName ?? u.fullname ?? full;
    this.displayName = name && name.length > 0 ? name : 'Usuario';

    // CV guardado en perfil
    const id = (u.id ?? u.userId ?? u.userID ?? '').toString();
    const email = (u.email ?? '').toString();
    const keyBase = id ? `cv_${id}` : email ? `cv_${email}` : 'cv_default';
    const cvNameKey = `${keyBase}_name`;

    const storedName = localStorage.getItem(cvNameKey);
    if (storedName) {
      this.cvNombre = storedName;
      this.hasCv = true;
    }
  }

  ngOnInit(): void {
    this.cargarSolicitudesRecientes();
    this.cargarVacanteSugerida();
  }

  // === SOLICITUDES RECIENTES ===
  private cargarSolicitudesRecientes(): void {
    let mapped: Solicitud[] = [];

    // 1) Intentar leer de reclutapp_applications
    try {
      const raw = localStorage.getItem('reclutapp_applications');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          mapped = arr.map((x: any) => ({
            puesto: String(x.puesto ?? ''),
            fecha: String(x.fecha ?? ''),
            estado: (x.estado as SolicitudEstado) || 'En revisión',
          }));
        }
      }
    } catch {
      mapped = [];
    }

    // 2) Si no hay nada allí, derivar de reclutapp_recomendations
    if (!mapped.length) {
      try {
        const rawRec = localStorage.getItem('reclutapp_recommendations');
        const arrRec = rawRec ? JSON.parse(rawRec) : [];
        if (Array.isArray(arrRec)) {
          mapped = arrRec.map((x: any) => ({
            puesto: String(x.puesto ?? ''),
            fecha: String(x.fecha ?? ''),
            estado: 'En revisión' as SolicitudEstado,
          }));
        }
      } catch {
        // ignoramos errores
      }
    }

    // Tomar solo las dos más recientes (primeras del array)
    this.solicitudes = mapped.slice(0, 2);
  }

  // === VACANTE SUGERIDA ===
  private cargarVacanteSugerida(): void {
    this.vacanciesSvc
      .list({ page: 1, pageSize: 10, search: '' })
      .subscribe((resp: any) => {
        const items: any[] = resp?.items ?? [];
        if (!items.length) {
          this.sugerida = null;
          return;
        }

        const v = items[0];
        this.sugerida = {
          id: String(v.id),
          puesto: String(v.title ?? 'Vacante'),
          ciudad: String(v.location ?? 'Sin ubicación'),
          fecha: this.toDateLabel(v.publishedOn),
        };
      });
  }

  private toDateLabel(value: string | Date | null | undefined): string {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-GT');
  }

  verVacante(): void {
    if (!this.sugerida) return;
    this.router.navigate(['/candidato/vacantes', this.sugerida.id]);
  }

  abrirPerfil(): void {
    this.router.navigate(['/candidato/perfil']);
  }

  estadoClass(e: SolicitudEstado) {
    return {
      rev: e === 'En revisión',
      rej: e === 'Rechazada',
      ok: e === 'Aceptada',
    };
  }
}
