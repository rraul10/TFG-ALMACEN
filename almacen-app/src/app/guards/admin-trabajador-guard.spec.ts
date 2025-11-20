import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminTrabajadorGuard } from './admin-trabajador-guard';

describe('adminTrabajadorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminTrabajadorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
