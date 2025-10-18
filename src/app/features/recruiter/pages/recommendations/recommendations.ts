import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

type Recomendacion = {
  puesto: string;
  candidato: string;
  email: string;
  fecha: string;        
  cvUrl?: string;       
};

@Component({
  selector: 'recruiter-recommendations',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './recommendations.html',
  styleUrls: ['./recommendations.scss'],
})
export class RecruiterRecommendationsComponent {
  recomendaciones: Recomendacion[] = [
    { puesto: 'Analista de datos',          candidato: 'Jorge Pérez',  email: 'jorge.perez@example.com',  fecha: '10/09/2025', cvUrl: '#' },
    { puesto: 'Ingeniero de Software',      candidato: 'Marcelo Ruiz', email: 'marcelo.ruiz@example.com', fecha: '08/09/2025', cvUrl: '#' },
    { puesto: 'Desarrollador Frontend',     candidato: 'Carlos García',email: 'carlos.garcia@example.com',fecha: '07/09/2025', cvUrl: '#' },
  ];

  verCV(r: Recomendacion) {
    console.log('Ver CV:', r);

    window.alert(`Abrir currículum de ${r.candidato} (mock)`);
  }

  contactar(r: Recomendacion) {
    console.log('Contactar:', r);

    window.location.href = `mailto:${r.email}?subject=Interés%20en%20tu%20perfil%20-%20${encodeURIComponent(r.puesto)}`;
  }
}
