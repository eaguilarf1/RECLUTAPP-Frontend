import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AppRole = 'ADMIN' | 'RECLUTADOR' | 'CANDIDATO';

export interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.api;
  private _user: any = JSON.parse(localStorage.getItem('user') || 'null');
  private _role: AppRole | null = (localStorage.getItem('role') as AppRole) ?? null;

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user(): any {
    return this._user;
  }

  getRole(): AppRole {
    return this._role ?? 'CANDIDATO';
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  hasRole(roles: AppRole[] | string[]): boolean {
    const r = this.getRole();
    return roles.map(x => x.toString().toUpperCase()).includes(r);
  }

  private normalizeRole(raw: any): AppRole {
    if (raw === 0 || raw === '0') return 'ADMIN';
    if (raw === 1 || raw === '1') return 'RECLUTADOR';
    if (raw === 2 || raw === '2') return 'CANDIDATO';
    const s = (raw ?? '').toString().toUpperCase();
    if (s.includes('ADMIN')) return 'ADMIN';
    if (s.includes('RECRU') || s.includes('RECLU')) return 'RECLUTADOR';
    if (s.includes('CANDID')) return 'CANDIDATO';
    return 'CANDIDATO';
  }

  private toDomainRole(role: AppRole | 'Admin' | 'Recruiter' | 'Candidate' | number): 'Admin' | 'Recruiter' | 'Candidate' | number {
    if (typeof role === 'number') return role;
    const s = role.toString().toUpperCase();
    if (s === 'ADMIN') return 'Admin';
    if (s.startsWith('RECLU') || s.startsWith('RECRU')) return 'Recruiter';
    return 'Candidate';
  }

  private setSession(resp: LoginResponse) {
    localStorage.setItem('token', resp.token);
    localStorage.setItem('Authorization', `Bearer ${resp.token}`);
    this._user = resp.user ?? null;
    localStorage.setItem('user', JSON.stringify(this._user));
    const rawRole = this._user?.role ?? this._user?.rol ?? this._user?.roleName ?? this._user?.tipo ?? this._user?.roleId;
    this._role = this.normalizeRole(rawRole);
    localStorage.setItem('role', this._role);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, { email, password }).pipe(
      tap(resp => this.setSession(resp))
    );
  }

  loginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/google`, { idToken }).pipe(
      tap(resp => this.setSession(resp))
    );
  }

  registerCandidate(nombre: string, email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/register`, { name: nombre, email, password }).pipe(
      tap(resp => this.setSession(resp))
    );
  }

  adminCreateUser(nombre: string, email: string, password: string, role: AppRole | 'Admin' | 'Recruiter' | 'Candidate' | number) {
    const mapped = this.toDomainRole(role);
    return this.http.post<any>(`${this.api}/users`, { name: nombre, email, password, role: mapped });
  }

  adminListUsers(page = 1, pageSize = 50, search?: string, role?: string) {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (role) params.role = role;
    return this.http.get<any>(`${this.api}/users`, { params });
  }

  adminUpdateUser(id: string, payload: { name?: string; email?: string; role?: AppRole | 'Admin' | 'Recruiter' | 'Candidate' | number; isActive?: boolean }) {
    const body: any = { ...payload };
    if (payload.role !== undefined) body.role = this.toDomainRole(payload.role as any);
    return this.http.put<void>(`${this.api}/users/${id}`, body);
  }

  adminDeleteUser(id: string) {
    return this.http.delete<void>(`${this.api}/users/${id}`);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('Authorization');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this._user = null;
    this._role = null;
  }
}
