import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

type Vacante = {
  id: number;
  titulo: string;
  ciudad: string;
  fecha: string;
  empresa?: string;
  descripcion?: string[];
};

@Component({
  selector: 'candidate-vacancy-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatDividerModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './vacancy-detail.html',
  styleUrls: ['./vacancy-detail.scss'],
})
export class VacancyDetailComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private VACANTES: Vacante[] = [
    { id: 1, titulo: 'Desarrollador Frontend', ciudad: 'Ciudad de Guatemala', fecha: '01/09/2025',
      empresa: 'RECLUTAPP', descripcion: ['Angular + Material', 'Experiencia con APIs REST', 'Trabajo híbrido'] },
    { id: 2, titulo: 'Analista de datos', ciudad: 'Quetzaltenango', fecha: '15/08/2025',
      empresa: 'DataCorp', descripcion: ['SQL, Power BI', 'Modelado de datos', 'Trabajo remoto'] },
    { id: 3, titulo: 'Ingeniero de software', ciudad: 'Ciudad de Guatemala', fecha: '10/08/2025',
      empresa: 'SoftHub', descripcion: ['Node/Java/Python', 'Prácticas de CI/CD'] },
  ];

  vacante?: Vacante;
cvNombre: string | null = null; 

get cvTexto() {
  return this.cvNombre ?? 'Adjuntar currículum';
}
  private readonly GT_PHONE = /^(?:\+502\s?)?(?:\d{4}[-\s]?\d{4})$/;

  form = this.fb.group({
    nombre: ['Carlos Gómez', [Validators.required, Validators.minLength(3)]],
    email: ['carlos.gomez@example.com', [Validators.required, Validators.email]],
    telefono: ['+502 2460 0000', [Validators.required, Validators.pattern(this.GT_PHONE)]],
    cover: [''],
  });

  get f(): { [k: string]: AbstractControl } { return this.form.controls; }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vacante = this.VACANTES.find(v => v.id === id) ?? this.VACANTES[0];
  }

  onSelectCV(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Por favor selecciona un PDF.');
      input.value = '';
      return;
    }
    this.cvNombre = file.name;
  }
  postular() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('Postulación (mock):', { vacanteId: this.vacante?.id, ...this.form.value, cv: this.cvNombre });
    alert('¡Tu postulación fue enviada (mock)!');
    this.router.navigate(['/candidato/solicitudes']);
  }
}
