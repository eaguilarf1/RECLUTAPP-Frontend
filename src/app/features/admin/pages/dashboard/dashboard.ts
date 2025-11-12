import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

type Row = { nombre: string; rol: 'Candidato'|'Reclutador'|'Administrador'; fecha: string };

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatDividerModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class AdminDashboardComponent implements OnInit {
  constructor(private auth: AuthService, private http: HttpClient) {
    const u = this.auth.user ?? {};
    const raw = (u.name ?? u.nombre ?? '').toString().trim();
    this.userName = raw.split(' ')[0] || 'Administrador';
  }

  userName = '';
  resumen = { vacantesActivas: 0, totalUsuarios: 0 };

  displayed = ['nombre','rol','fecha'];
  recientes: Row[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  private roleToLabel(raw: any): 'Candidato'|'Reclutador'|'Administrador' {
    if (raw === 0 || `${raw}`.toUpperCase().startsWith('ADMIN')) return 'Administrador';
    if (raw === 1 || `${raw}`.toUpperCase().startsWith('RECRU')) return 'Reclutador';
    return 'Candidato';
  }

  private loadStats(): void {
    this.http.get<any>(`${environment.api}/admin/stats`).subscribe({
      next: (res) => {
        this.resumen.vacantesActivas = res?.activeVacancies ?? 0;
        this.resumen.totalUsuarios = res?.totalUsers ?? 0;
        const last = Array.isArray(res?.lastUsers) ? res.lastUsers : [];
        this.recientes = last.map((u: any) => ({
          nombre: u.name,
          rol: this.roleToLabel(u.role),
          fecha: new Date(u.createdAt).toLocaleDateString('es-GT'),
        }));
      }
    });
  }
}
