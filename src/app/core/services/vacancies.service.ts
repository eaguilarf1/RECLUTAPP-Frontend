import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API_BASE_URL = 'http://localhost:5069';

export interface VacanciesPagedResponse {
  page: number;
  pageSize: number;
  total: number;
  items: VacancyItem[];
}

export interface VacancyItem {
  id: string;
  title: string;
  recruiter: string;
  description?: string | null;
  location?: string | null;
  status: number;           
  publishedOn: string;     
}

export interface VacancyCreateDto {
  title: string;
  recruiter: string;
  description?: string | null;
  location?: string | null;
  status?: number;       
  publishedOn?: string; 
}

export interface VacancyUpdateDto extends VacancyCreateDto {}

@Injectable({ providedIn: 'root' })
export class VacanciesService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/vacancies`;

  list(opts?: { page?: number; pageSize?: number; search?: string; status?: number }): Observable<VacanciesPagedResponse> {
    let params = new HttpParams();
    if (opts?.page)     params = params.set('page', String(opts.page));
    if (opts?.pageSize) params = params.set('pageSize', String(opts.pageSize));
    if (opts?.search)   params = params.set('search', opts.search);
    if (opts?.status !== undefined) params = params.set('status', String(opts.status));
    return this.http.get<VacanciesPagedResponse>(this.base, { params });
  }

  get(id: string): Observable<VacancyItem> {
    return this.http.get<VacancyItem>(`${this.base}/${id}`);
  }

  create(dto: VacancyCreateDto): Observable<VacancyItem> {
    return this.http.post<VacancyItem>(this.base, dto);
  }

  update(id: string, dto: VacancyUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  static toDateLabel(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  static toEstadoChip(status: number): 'Activa' | 'Inactiva' {
    return status === 0 ? 'Activa' : 'Inactiva';
  }

  static toIsoUTCDate(d: Date): string {
  const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
  return new Date(Date.UTC(y, m, day, 0, 0, 0)).toISOString();
}

}


