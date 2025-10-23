import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { VacanciesService, VacancyItem } from '../../../../core/services/vacancies.service';

@Component({
  selector: 'admin-edit-vacancy',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule
  ],
  templateUrl: './edit-vacancy.html',
  styleUrls: ['./edit-vacancy.scss'],
})
export class AdminEditVacancyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vacanciesSvc = inject(VacanciesService);

  loading = false;
  vacancyId!: string;

  ubicaciones = [
    'Ciudad de Guatemala',
    'Quetzaltenango',
    'Antigua Guatemala',
    'Escuintla',
    'Mixco',
  ];

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    ubicacion: ['', Validators.required],

    fechaInicio: [new Date(), Validators.required],
  });

  ngOnInit(): void {
    this.vacancyId = String(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.vacanciesSvc.get(this.vacancyId).subscribe({
      next: (v: VacancyItem) => {
        const fecha = new Date(v.publishedOn);
        this.form.patchValue({
          titulo: v.title ?? '',
          descripcion: v.description ?? '',
          ubicacion: v.location ?? 'Ciudad de Guatemala',
          fechaInicio: isNaN(fecha.getTime()) ? new Date() : fecha,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('No fue posible cargar la vacante.');
        this.loading = false;
      }
    });
  }

  guardarCambios() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;

  const rawFecha = this.form.get('fechaInicio')?.value as unknown;
  const fecha: Date = rawFecha instanceof Date ? rawFecha : new Date(rawFecha as any);

  this.vacanciesSvc.get(this.vacancyId).subscribe({
    next: (full) => {
      const dto = {
        title: this.form.value.titulo!.trim(),
        recruiter: full.recruiter,
        description: this.form.value.descripcion?.trim() ?? null,
        location: this.form.value.ubicacion ?? null,
        status: full.status,
        publishedOn: VacanciesService.toIsoUTCDate(fecha)
      };
      this.vacanciesSvc.update(this.vacancyId, dto).subscribe({
        next: () => {
          this.loading = false;
          alert('Cambios guardados correctamente.');
          this.router.navigate(['/admin/resumen-vacantes']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          alert('No fue posible guardar los cambios.');
        }
      });
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      alert('No fue posible leer la vacante.');
    }
  });
}

cancelar() {
    this.router.navigate(['/admin/resumen-vacantes']);
  }
}
