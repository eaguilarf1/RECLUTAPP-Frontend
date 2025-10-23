import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { VacanciesService, VacancyItem } from '../../../../core/services/vacancies.service';

type Vacante = { id: string; titulo: string; ciudad: string; fecha: string };

@Component({
  selector: 'candidate-vacancies',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './vacancies.html',
  styleUrls: ['./vacancies.scss'],
})
export class VacanciesComponent implements OnInit {
  private vacanciesSvc = inject(VacanciesService);

  vacantes: Vacante[] = [];

  ngOnInit(): void {
    // Pagina 1, 12 items por defecto
    this.vacanciesSvc.list({ page: 1, pageSize: 12 }).subscribe(resp => {
      this.vacantes = resp.items.map((v: VacancyItem) => ({
        id: v.id,
        titulo: v.title,
        ciudad: v.location ?? 'Sin ubicación',
        fecha: VacanciesService.toDateLabel(v.publishedOn),
      }));
    });
  }
}
