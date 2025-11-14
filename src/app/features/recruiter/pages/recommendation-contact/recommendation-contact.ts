import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';

type ContactRec = {
  puesto: string;
  candidato: string;
  email: string;
  fecha: string;
  telefono?: string;
  mensaje?: string;
  cvNombre?: string;
  cvData?: string;
};

@Component({
  selector: 'recruiter-recommendation-contact',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './recommendation-contact.html',
  styleUrls: ['./recommendation-contact.scss'],
})
export class RecommendationContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  rec?: ContactRec;

  form = this.fb.group({
    nombre: [''],
    email: [''],
    telefono: [''],
    mensaje: ['']
  });

  ngOnInit(): void {
    let data: ContactRec | null = null;
    try {
      data = JSON.parse(localStorage.getItem('reclutapp_contact_rec') ?? 'null');
    } catch {
      data = null;
    }

    if (!data) {
      this.router.navigate(['/reclutador/recomendaciones']);
      return;
    }

    this.rec = data;

    this.form.patchValue({
      nombre: data.candidato,
      email: data.email,
      telefono: data.telefono ?? '',
      mensaje: data.mensaje ?? ''
    });

    this.form.disable();
  }

  generarCorreo() {
    if (!this.rec) return;

    const subject = `Respuesta a tu postulación para ${this.rec.puesto}`;

    const bodyLines: string[] = [
      `Hola ${this.rec.candidato},`,
      '',
      `He revisado tu postulación para el puesto de ${this.rec.puesto}.`,
      ''
    ];

    const mensajeTrim = (this.rec.mensaje ?? '').trim();
    if (mensajeTrim) {
      bodyLines.push(
        'Mensaje que enviaste en tu postulación:',
        mensajeTrim,
        ''
      );
    }

    bodyLines.push(
      'Saludos,',
      '[Nombre del reclutador]'
    );

    const body = bodyLines.join('\n');
    window.location.href =
      `mailto:${this.rec.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  volver() {
    this.router.navigate(['/reclutador/recomendaciones']);
  }
}
