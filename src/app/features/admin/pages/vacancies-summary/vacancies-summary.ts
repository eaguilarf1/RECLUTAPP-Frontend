import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

type VacancyRow = {
  id: string;
  title: string;
  recruiter: string;
  applications: number;
  publishedAt: Date;
  year: number;
};

@Component({
  selector: 'admin-vacancies-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatIconModule,
    MatFormFieldModule, MatSelectModule,
    MatTableModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './vacancies-summary.html',
  styleUrls: ['./vacancies-summary.scss'],
})
export class AdminVacanciesSummaryComponent {

  private initial: VacancyRow[] = [
    { id: 'v1', title: 'Desarrollador Backend',  recruiter: 'Juan Pérez',   applications: 12, publishedAt: new Date(2025, 8, 20), year: 2025 },
    { id: 'v2', title: 'Ingeniero de Datos',     recruiter: 'Ana López',    applications: 15, publishedAt: new Date(2025, 8, 18), year: 2025 },
    { id: 'v3', title: 'Diseñador UX/UI',        recruiter: 'Carlos Gómez', applications: 10, publishedAt: new Date(2025, 8, 15), year: 2025 },

    { id: 'v4', title: 'QA Automation',          recruiter: 'Juan Pérez',   applications: 8,  publishedAt: new Date(2024, 4, 10), year: 2024 },
    { id: 'v5', title: 'Data Analyst',           recruiter: 'Ana López',    applications: 9,  publishedAt: new Date(2024, 6,  2), year: 2024 },
  ];

  vacancies = signal<VacancyRow[]>(this.initial);

  years = Array.from(new Set(this.initial.map(v => v.year))).sort((a,b)=>b-a);
  year = signal<number>(this.years[0]);

  rows = computed(() =>
    this.vacancies().filter(v => v.year === this.year())
  );

  displayedColumns = ['title', 'recruiter', 'publishedAt', 'actions'];

  totals = computed(() => {
    const list = this.rows();
    const actives = list.length; 
    const apps    = list.reduce((s, v) => s + v.applications, 0);
    const last    = list.length ? new Date(Math.max(...list.map(v => v.publishedAt.getTime()))) : undefined;
    return { actives, apps, last };
  });

  onYearChange(value: number) {
    this.year.set(value);
  }

  edit(row: VacancyRow) {

    console.log('Editar vacante', row);
    alert(`Editar vacante: ${row.title} (mock)`);
  }

  delete(row: VacancyRow) {
    if (!confirm(`¿Eliminar la vacante "${row.title}" publicada por ${row.recruiter}?`)) return;
    this.vacancies.update(arr => arr.filter(v => v.id !== row.id));
  }
}
