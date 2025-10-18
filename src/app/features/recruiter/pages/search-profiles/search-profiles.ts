import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

type Perfil = {
  nombre: string;
  habilidades: string[];
  ubicacion: string;
  score: number;
};

@Component({
  selector: 'recruiter-search-profiles',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSliderModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './search-profiles.html',
  styleUrls: ['./search-profiles.scss'],
})
export class RecruiterSearchProfilesComponent {

  perfiles: Perfil[] = [
    { nombre: 'Juan Pérez',    habilidades: ['Java', 'MySQL', 'Spring Boot'], ubicacion: 'Guatemala',         score: 82 },
    { nombre: 'María López',   habilidades: ['JavaScript', 'Node.js', 'C#'],   ubicacion: 'Guatemala',         score: 75 },
    { nombre: 'Pedro Martínez',habilidades: ['Python', 'Django', 'Pandas'],    ubicacion: 'Quetzaltenango',    score: 88 },
    { nombre: 'Lucía Ramírez', habilidades: ['Angular', 'RxJS', 'REST'],       ubicacion: 'Antigua Guatemala', score: 69 },
  ];

  ubicaciones = ['Todas', 'Guatemala', 'Quetzaltenango', 'Antigua Guatemala', 'Escuintla', 'Mixco'];

  q = new FormControl<string>('', { nonNullable: true });
  loc = new FormControl<string>('Todas', { nonNullable: true });
  min = new FormControl<number>(0, { nonNullable: true });

  get resultados(): Perfil[] {
    const term = (this.q.value || '').trim().toLowerCase();
    const selLoc = this.loc.value;
    const minScore = this.min.value;

    return this.perfiles.filter(p => {
      const matchesText =
        !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.habilidades.some(h => h.toLowerCase().includes(term));

      const matchesLoc = selLoc === 'Todas' || p.ubicacion === selLoc;
      const matchesScore = (p.score ?? 0) >= (minScore ?? 0);
      return matchesText && matchesLoc && matchesScore;
    });
  }

  verPerfil(p: Perfil) {
    console.log('Ver perfil:', p);
    alert(`Ver perfil de ${p.nombre} (mock)`);
  }
}
