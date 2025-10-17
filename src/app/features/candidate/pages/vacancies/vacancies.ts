import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

type Vacante = { id: number; titulo: string; ciudad: string; fecha: string };

@Component({
  selector: 'candidate-vacancies',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './vacancies.html',
  styleUrls: ['./vacancies.scss'],
})
export class VacanciesComponent {
  vacantes: Vacante[] = [
  { id: 1, titulo: 'Desarrollador Frontend', ciudad: 'Ciudad de Guatemala', fecha: '01/09/2025' },
  { id: 2, titulo: 'Analista de datos', ciudad: 'Quetzaltenango', fecha: '15/08/2025' },
  { id: 3, titulo: 'Ingeniero de software', ciudad: 'Ciudad de Guatemala', fecha: '10/08/2025' },
  { id: 4, titulo: 'QA Tester', ciudad: 'Antigua Guatemala', fecha: '05/09/2025' },
  { id: 5, titulo: 'Administrador de BD', ciudad: 'Escuintla', fecha: '28/08/2025' },
  { id: 6, titulo: 'UX/UI Designer', ciudad: 'Mixco', fecha: '21/08/2025' },
  ];
}
