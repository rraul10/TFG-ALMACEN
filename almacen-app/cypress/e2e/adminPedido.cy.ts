/// <reference types="cypress" />

describe('Admin: Acceder a gestión de pedidos y cambiar estado', () => {
  const adminEmail = 'admin@example.com'; 
  const adminPassword = 'admin123';     
  const pedidoId: string = '4'; 
  const nuevoEstado = 'PREPARACION'; 

  it('Login como admin, abrir gestión de pedidos y cambiar estado', () => {
    cy.viewport(1600, 1200);

    cy.visit('https://tfg-almacen-1.onrender.com/login');

    cy.document().then(doc => {
      const style = doc.createElement('style');
      style.innerHTML = `
        body, html {
          height: 100%;
          overflow: hidden !important;
        }
        .login-container {
          position: fixed !important;
          top: 50% !important;
          right: 50px;
          transform: translateY(-50%) !important;
        }
      `;
      doc.head.appendChild(style);
    });

    cy.get('input[name="correo"]').scrollIntoView().type(adminEmail, { delay: 100 });
    cy.get('input[name="password"]').scrollIntoView().type(adminPassword, { delay: 100 });

    cy.get('button[type="submit"]').scrollIntoView().click();

    cy.contains('✓ Acceso concedido', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    cy.get('.user-menu .avatar-btn').scrollIntoView().click();
    cy.get('.menu-dropdown .menu-item').contains('Gestión Pedidos').scrollIntoView().click();

    cy.url().should('include', '/admin/pedidos');
    cy.contains('📋 Gestión de Pedidos').should('be.visible');

    cy.intercept('PUT', new RegExp(`/api/pedidos/estado/${pedidoId}\\?.*`)).as('updatePedido');

    cy.contains('.pedido-card', `Pedido #${pedidoId}`)
      .scrollIntoView()   
      .as('pedidoCard');

    cy.get('@pedidoCard').find('select')
      .scrollIntoView()
      .select(nuevoEstado, { force: true })
      .trigger('change');

    cy.get('@pedidoCard').find('select').should('have.value', nuevoEstado);

    cy.wait('@updatePedido').its('response.statusCode').should('eq', 200);

  });
});
