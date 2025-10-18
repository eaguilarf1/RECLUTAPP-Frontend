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

    console.log('Vacante publicada:', this.form.value);
    alert('Vacante publicada (mock).');
    this.form.reset({
      ubicacion: 'Ciudad de Guatemala',
      modalidad: 'Híbrido',
      fechaInicio: new Date(),
    });
  }
}
