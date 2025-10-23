import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { VacanciesService, VacancyItem } from '../../../../core/services/vacancies.service';

type Row = {
  id: string;
  title: string;
  recruiter: string;
  publishedAt: Date;
  status: number;
  publishedOnIso: string;
  location?: string | null;
  estadoLabel?: 'Activa' | 'Inactiva';
};

@Component({
  selector: 'admin-vacancies-summary',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatTableModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule
  ],
  templateUrl: './vacancies-summary.html',
  styleUrls: ['./vacancies-summary.scss'],
})
export class AdminVacanciesSummaryComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);   // 👈 para navegar relativo
  private vacanciesSvc = inject(VacanciesService);

  loading = false;
  errorMsg: string | null = null;

  displayedColumns = ['title', 'recruiter', 'publishedAt', 'actions'];

  private all = signal<Row[]>([]);

  private currentYear = new Date().getFullYear();
  year = signal<number>(this.currentYear);
  years: number[] = [this.currentYear];

  rows = signal<Row[]>([]);

  totals = computed(() => {
    const data = this.rows();
    const actives = data.filter(d => d.status === 0).length;
    const last = data.length
      ? new Date(
          data
            .map(d => d.publishedAt)
            .filter(d => !isNaN(d.getTime()))
            .sort((a, b) => b.getTime() - a.getTime())[0]
        )
      : null;
    return { actives, apps: 0, last };
  });

  ngOnInit(): void { this.load(); }

  private mapToRow = (v: VacancyItem): Row => {
    const d = new Date(v.publishedOn);
    const safe = isNaN(d.getTime()) ? new Date() : d;
    return {
      id: v.id,
      title: v.title,
      recruiter: v.recruiter ?? '—',
      publishedAt: safe,
      status: v.status,
      publishedOnIso: v.publishedOn,
      location: v.location ?? null,
      estadoLabel: VacanciesService.toEstadoChip(v.status),
    };
  };

  load() {
    this.loading = true; this.errorMsg = null;
    this.vacanciesSvc.list({ page: 1, pageSize: 500 }).subscribe({
      next: (resp) => {
        const mapped = resp.items.map(this.mapToRow);
        this.all.set(mapped);

        const ys = Array.from(new Set(mapped.map(r => r.publishedAt.getFullYear()))).sort((a, b) => b - a);
        this.years = ys.length ? ys : [this.currentYear];
        if (!this.years.includes(this.year())) this.year.set(this.years[0]);

        this.applyFilter();
        this.loading = false;
      },
      error: (err) => { console.error(err); this.errorMsg = 'No fue posible cargar las vacantes.'; this.rows.set([]); this.loading = false; }
    });
  }

  onYearChange(newYear: number) { this.year.set(newYear); this.applyFilter(); }

  private applyFilter() {
    const y = this.year();
    const filtered = this.all().filter(r => r.publishedAt.getFullYear() === y);
    this.rows.set(filtered);
  }

  // === EDITAR → navegar RELATIVO al admin ===
  edit(row: Row) {
    // Si estás en /admin/resumen-vacantes, esto navega a /admin/editar-vacante/:id
    this.router.navigate(['../editar-vacante', row.id], { relativeTo: this.route });
  }
  onEditar(row: Row) { this.edit(row); }
  editar(row: Row) { this.edit(row); }
  editarVacante(row: Row) { this.edit(row); }
  toggleEdit(row: Row) { this.edit(row); }
  enableEdit(row: Row) { this.edit(row); }

  // === ELIMINAR ===
  delete(row: Row) {
    if (!confirm(`¿Eliminar la vacante "${row.title}" publicada por ${row.recruiter}?`)) return;
    this.vacanciesSvc.delete(row.id).subscribe({
      next: () => this.load(),
      error: (err) => { console.error(err); alert('No fue posible eliminar la vacante.'); }
    });
  }

  refresh() { this.load(); }
}
