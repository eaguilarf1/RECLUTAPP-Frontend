import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../../core/services/auth.service';
import {
  VacanciesService,
  VacancyItem,
} from '../../../../core/services/vacancies.service';

type Vacante = { puesto: string; fecha: string; estado: 'Abierta' | 'Cerrada' };

@Component({
  selector: 'recruiter-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class RecruiterDashboardComponent implements OnInit {
  userName = '';
  displayedColumns = ['puesto', 'fecha', 'estado'];
  vacantes: Vacante[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private vacanciesSvc: VacanciesService
  ) {
    const u: any = this.auth.user ?? {};
    const raw = (u.name ?? u.nombre ?? '').toString().trim();
    this.userName = raw.split(' ')[0] || 'Reclutador';
  }

  ngOnInit(): void {
    this.cargarVacantes();
  }

  private cargarVacantes() {
    this.vacanciesSvc
      .list({ page: 1, pageSize: 50, search: '' })
      .subscribe((resp: any) => {
        const items: VacancyItem[] = (resp?.items as VacancyItem[]) ?? resp ?? [];

        this.vacantes = items.map((v) => {
          const anyV: any = v;

          const estadoRaw = (anyV.state ?? anyV.status ?? anyV.estado ?? 'Abierta')
            .toString()
            .toLowerCase();

          const estado: 'Abierta' | 'Cerrada' =
            estadoRaw === 'cerrada' || estadoRaw === 'closed'
              ? 'Cerrada'
              : 'Abierta';

          return {
            puesto: String(v.title ?? ''),
            fecha: VacanciesService.toDateLabel(v.publishedOn),
            estado,
          };
        });
      });
  }

  crearVacante() {
    this.router.navigate(['/reclutador/crear-vacante']);
  }

  buscarPerfiles() {
    this.router.navigate(['/reclutador/buscar-perfiles']);
  }
}
