import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

type Estado = 'Activa' | 'Inactiva';
type Vacante = {
  puesto: string;
  ubicacion: string;
  fechaPublicacion: string; // dd/mm/yyyy
  estado: Estado;
};

@Component({
  selector: 'recruiter-vacancies',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatDividerModule],
  templateUrl: './vacancies.html',
  styleUrls: ['./vacancies.scss'],
})
export class RecruiterVacanciesComponent {
  displayedColumns = ['puesto', 'ubicacion', 'fecha', 'estado'];

  vacantes: Vacante[] = [
    { puesto: 'Desarrollador Backend', ubicacion: 'Ciudad de Guatemala', fechaPublicacion: '08/08/2025', estado: 'Activa' },
    { puesto: 'Ingeniero de datos',    ubicacion: 'Quetzaltenango',      fechaPublicacion: '04/08/2025', estado: 'Activa' },
    { puesto: 'Diseñador UX/UI',       ubicacion: 'Guatemala',           fechaPublicacion: '01/08/2025', estado: 'Inactiva' },
  ];
}
