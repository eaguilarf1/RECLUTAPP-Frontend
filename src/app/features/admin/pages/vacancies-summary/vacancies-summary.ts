import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

type Row = {
  recruiter: string;
  actives: number;
  applications: number;
  lastDate: Date;
  year: number;
};

@Component({
  selector: 'admin-vacancies-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatIconModule,
    MatFormFieldModule, MatSelectModule,
    MatTableModule
  ],
  templateUrl: './vacancies-summary.html',
  styleUrls: ['./vacancies-summary.scss'],
})
export class AdminVacanciesSummaryComponent {
  // Mock de datos (cámbialo cuando conectes el backend)
  private all: Row[] = [
    { recruiter: 'Juan Pérez',   actives: 2, applications: 20, lastDate: new Date(2025, 8, 20), year: 2025 },
    { recruiter: 'Ana López',    actives: 1, applications: 15, lastDate: new Date(2025, 8, 18), year: 2025 },
    { recruiter: 'Carlos Gómez', actives: 1, applications: 10, lastDate: new Date(2025, 8, 15), year: 2025 },

    { recruiter: 'Juan Pérez',   actives: 3, applications: 32, lastDate: new Date(2024, 4, 10), year: 2024 },
    { recruiter: 'Ana López',    actives: 2, applications: 18, lastDate: new Date(2024, 6,  2), year: 2024 },
  ];

  years = Array.from(new Set(this.all.map(r => r.year))).sort((a,b)=>b-a);
  year = signal<number>(this.years[0]);

  rows = computed(() => this.all.filter(r => r.year === this.year()));
  displayedColumns = ['recruiter', 'actives', 'applications', 'lastDate'];

  totals = computed(() => {
    const list = this.rows();
    const actives = list.reduce((s, r) => s + r.actives, 0);
    const apps    = list.reduce((s, r) => s + r.applications, 0);
    const last    = list.length ? new Date(Math.max(...list.map(r => r.lastDate.getTime()))) : undefined;
    return { actives, apps, last };
  });

  onYearChange(value: number) {
    this.year.set(value);
  }
}
