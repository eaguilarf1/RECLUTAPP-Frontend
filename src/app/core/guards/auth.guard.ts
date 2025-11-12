import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService, AppRole } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.parseUrl('/auth/login');
    }
    const roles = route.data?.['roles'] as AppRole[] | undefined;
    if (roles?.length && !this.auth.hasRole(roles)) {
      const role = this.auth.getRole();
      const fallback =
        role === 'ADMIN' ? '/admin/inicio' :
        role === 'RECLUTADOR' ? '/reclutador/inicio' :
        '/candidato/inicio';
      if (state.url === fallback) return true;
      return this.router.parseUrl(fallback);
    }
    return true;
  }
}
