import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { VacanciesService, VacancyItem } from '../../../../core/services/vacancies.service';
import { AuthService } from '../../../../core/services/auth.service';

type Vacante = {
  id: string;
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
export class VacancyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private vacanciesSvc = inject(VacanciesService);
  private auth = inject(AuthService);

  vacante?: Vacante;
  cvNombre: string | null = null;

  get cvTexto() {
    return this.cvNombre ?? 'No tienes currículum guardado. Actualízalo en tu perfil.';
  }

  private readonly GT_PHONE = /^(?:\+502\s?)?(?:\d{4}[-\s]?\d{4})$/;

  form = this.fb.group({
    nombre: ['Carlos Gómez', [Validators.required, Validators.minLength(3)]],
    email: ['carlos.gomez@example.com', [Validators.required, Validators.email]],
    telefono: ['+502 5555-5555', [Validators.required, (c: AbstractControl) =>
      this.GT_PHONE.test(String(c.value ?? '')) ? null : { phone: true }
    ]],
    mensaje: ['Estoy interesado en la vacante.', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    const a: any = this.auth as any;
    let u: any = a?.user;
    if (!u) {
      try {
        u = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {};
      } catch {
        u = {};
      }
    }

    const current = this.form.value;
    const phone = (u.phone ?? u.telefono ?? localStorage.getItem('candidate_phone') ?? current.telefono) as string;

    this.form.patchValue({
      nombre: (((u.name ?? u.nombre ?? '') as string).toString().trim()) || (current.nombre as string),
      email: (((u.email ?? '') as string).toString().trim()) || (current.email as string),
      telefono: phone || (current.telefono as string),
    });

    const idKey = (u.id ?? u.userId ?? u.userID ?? '').toString();
    const emailKey = (u.email ?? '').toString();
    const keyBase = idKey ? `cv_${idKey}` : (emailKey ? `cv_${emailKey}` : 'cv_default');
    const cvNameKey = `${keyBase}_name`;
    const existingCvName = localStorage.getItem(cvNameKey);
    if (existingCvName) this.cvNombre = existingCvName;

    const id = String(this.route.snapshot.paramMap.get('id'));
    this.vacanciesSvc.get(id).subscribe((v: VacancyItem) => {
      this.vacante = {
        id: v.id,
        titulo: v.title,
        ciudad: v.location ?? 'Sin ubicación',
        fecha: VacanciesService.toDateLabel(v.publishedOn),
        empresa: v.recruiter,
        descripcion: (v.description ?? '')
          .split(/\r?\n|\. /)
          .map(s => s.trim())
          .filter(s => s.length > 0)
      };
    });
  }

  onSelectCV(ev: Event) {
    this.onFileChange(ev);
  }

  onFileChange(ev: Event) {
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
