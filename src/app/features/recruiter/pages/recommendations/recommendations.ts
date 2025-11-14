import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';

type Recomendacion = {
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
  selector: 'recruiter-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './recommendations.html',
  styleUrls: ['./recommendations.scss'],
})
export class RecruiterRecommendationsComponent implements OnInit {
  private router = inject(Router);

  recomendaciones: Recomendacion[] = [];

  ngOnInit(): void {
    const key = 'reclutapp_recommendations';
    let data: any[] = [];
    try {
      data = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }

    this.recomendaciones = data.map(x => ({
      puesto: String(x.puesto ?? ''),
      candidato: String(x.candidato ?? ''),
      email: String(x.email ?? ''),
      fecha: String(x.fecha ?? ''),
      telefono: x.telefono ? String(x.telefono) : undefined,
      mensaje: x.mensaje ? String(x.mensaje) : undefined,
      cvNombre: x.cvNombre ? String(x.cvNombre) : undefined,
      cvData: x.cvData ? String(x.cvData) : undefined
    }));
  }

  verCV(r: Recomendacion) {
    if (!r.cvData) {
      window.alert('El candidato no tiene currículum adjunto o no está disponible.');
      return;
    }

    const byteString = atob(r.cvData);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  contactar(r: Recomendacion) {
    localStorage.setItem('reclutapp_contact_rec', JSON.stringify(r));
    this.router.navigate(['/reclutador/recomendaciones/contactar']);
  }
}
