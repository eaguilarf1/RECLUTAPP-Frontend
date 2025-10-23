import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { VacanciesService } from '../../../../core/services/vacancies.service';

@Component({
  selector: 'create-vacancy',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule
  ],
  templateUrl: './create-vacancy.html',
  styleUrls: ['./create-vacancy.scss'],
})
export class CreateVacancyComponent {
  private fb = inject(FormBuilder);
  private vacanciesSvc = inject(VacanciesService);

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
    ubicacion: ['Ciudad de Guatemala', Validators.required],
    fechaInicio: [new Date(), Validators.required],
    salario: [''],         
    modalidad: ['Híbrido'], 
  });

  publicar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const rawFecha = this.form.get('fechaInicio')?.value as unknown;
  const fecha: Date = rawFecha instanceof Date ? rawFecha : new Date(rawFecha as any);

  const dto = {
    title: this.form.value.titulo!.trim(),
    recruiter: 'RECLUTAPP',
    description: this.form.value.descripcion?.trim() ?? null,
    location: this.form.value.ubicacion ?? null,
    status: 0,
    publishedOn: VacanciesService.toIsoUTCDate(fecha)
  };

  this.vacanciesSvc.create(dto).subscribe({
    next: () => {
      alert('Vacante publicada correctamente.');
      this.form.reset({
        titulo: '',
        descripcion: '',
        ubicacion: 'Ciudad de Guatemala',
        fechaInicio: new Date()
      });
    },
    error: () => {
      alert('No fue posible publicar la vacante.');
    }
  });
}
}
