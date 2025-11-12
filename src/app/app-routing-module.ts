import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard de autenticación por rol 
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  // --- AUTH ---
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'auth/login-reclutador',
    loadComponent: () =>
      import('./features/auth/pages/login-recruiter/login-recruiter')
        .then(m => m.LoginRecruiterComponent),
  },
  {
    path: 'auth/login-admin',
    loadComponent: () =>
      import('./features/auth/pages/login-admin/login-admin')
        .then(m => m.LoginAdminComponent),
  },
  {
    path: 'auth/forgot',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password')
        .then(m => m.ForgotPasswordComponent),
  },

  // --- CANDIDATO ---
  {
    path: 'candidato',
    canActivate: [AuthGuard],
    data: { roles: ['Candidate'] },
    loadComponent: () =>
      import('./features/candidate/layout/layout').then(m => m.CandidateLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/candidate/pages/dashboard/dashboard')
            .then(m => m.DashboardComponent),
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./features/candidate/pages/applications/applications')
            .then(m => m.ApplicationsComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/candidate/pages/profile/profile')
            .then(m => m.ProfileComponent),
      },
      {
        path: 'vacantes',
        loadComponent: () =>
          import('./features/candidate/pages/vacancies/vacancies')
            .then(m => m.VacanciesComponent),
      },
      {
        path: 'vacantes/:id',
        loadComponent: () =>
          import('./features/candidate/pages/vacancy-detail/vacancy-detail')
            .then(m => m.VacancyDetailComponent),
      },
    ],
  },

  // --- RECLUTADOR ---
  {
    path: 'reclutador',
    canActivate: [AuthGuard],
    data: { roles: ['Recruiter'] },
    loadComponent: () =>
      import('./features/recruiter/layout/layout').then(m => m.RecruiterLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/recruiter/pages/dashboard/dashboard')
            .then(m => m.RecruiterDashboardComponent),
      },
      {
        path: 'crear-vacante',
        loadComponent: () =>
          import('./features/recruiter/pages/create-vacancy/create-vacancy')
            .then(m => m.CreateVacancyComponent),
      },
      {
        path: 'editar-vacante/:id',
        loadComponent: () =>
          import('./features/recruiter/pages/edit-vacancy/edit-vacancy')
            .then(m => m.RecruiterEditVacancyComponent),
      },
      {
        path: 'vacantes',
        loadComponent: () =>
          import('./features/recruiter/pages/vacancies/vacancies')
            .then(m => m.RecruiterVacanciesComponent),
      },
      {
        path: 'recomendaciones',
        loadComponent: () =>
          import('./features/recruiter/pages/recommendations/recommendations')
            .then(m => m.RecruiterRecommendationsComponent),
      },
      {
        path: 'buscar-perfiles',
        loadComponent: () =>
          import('./features/recruiter/pages/search-profiles/search-profiles')
            .then(m => m.RecruiterSearchProfilesComponent),
      },
    ],
  },

  // --- ADMINISTRADOR ---
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./features/admin/layout/layout')
        .then(m => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard')
            .then(m => m.AdminDashboardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/pages/users/users')
            .then(m => m.AdminUsersPage),
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () =>
          import('./features/admin/pages/users-new/users-new')
            .then(m => m.AdminUserNewComponent),
      },
      {
        path: 'resumen-vacantes',
        loadComponent: () =>
          import('./features/admin/pages/vacancies-summary/vacancies-summary')
            .then(m => m.AdminVacanciesSummaryComponent),
      },
      {
        path: 'editar-vacante/:id',
        loadComponent: () =>
          import('./features/admin/pages/edit-vacancy/edit-vacancy')
            .then(m => m.AdminEditVacancyComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
