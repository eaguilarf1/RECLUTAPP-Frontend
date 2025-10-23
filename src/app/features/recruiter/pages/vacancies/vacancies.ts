import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { VacanciesService, VacancyItem } from '../../../../core/services/vacancies.service';

type Vacante = {
  id: string;
  puesto: string;
  ubicacion: string;
  fechaPublicacion: string; // dd/mm/yyyy
};

@Component({
  selector: 'recruiter-vacancies',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './vacancies.html',
  styleUrls: ['./vacancies.scss'],
})
export class RecruiterVacanciesComponent implements OnInit {
  private vacanciesSvc = inject(VacanciesService);
  private router = inject(Router);

  displayedColumns = ['puesto', 'ubicacion', 'fecha', 'acciones'];
  vacantes: Vacante[] = [];

  ngOnInit(): void {
    this.vacanciesSvc.list({ page: 1, pageSize: 20 }).subscribe(resp => {
      this.vacantes = resp.items.map((v: VacancyItem) => ({
        id: v.id,
        puesto: v.title,
        ubicacion: v.location ?? 'Sin ubicación',
        fechaPublicacion: VacanciesService.toDateLabel(v.publishedOn)
      }));
    });
  }

onEditar(row: Vacante) {
  this.router.navigate(['/reclutador/editar-vacante', row.id]);
}

  onEliminar(row: Vacante) {
    if (!confirm(`¿Eliminar la vacante "${row.puesto}"?`)) return;
    this.vacanciesSvc.delete(row.id).subscribe({
      next: () => { this.vacantes = this.vacantes.filter(v => v.id !== row.id); },
      error: () => alert('No fue posible eliminar la vacante.')
    });
  }
}
