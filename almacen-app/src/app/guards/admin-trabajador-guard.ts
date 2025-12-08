import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { RoleService } from '../core/services/role.service';

export const adminTrabajadorGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const role = roleService.getRol();

  if (role === 'ADMIN' || role === 'TRABAJADOR') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
