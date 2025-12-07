/// <reference types="cypress" />

describe('Admin: Acceder a gestión de pedidos y cambiar estado', () => {
  const adminEmail = 'admin@example.com'; 
  const adminPassword = 'admin123';     
  const pedidoId: string = '4'; // ID del pedido como string
  const nuevoEstado = 'PREPARACION'; // Nuevo estado que quieres asignar

  it('Login como admin, abrir gestión de pedidos y cambiar estado', () => {
    cy.viewport(1600, 1200);

    cy.visit('http://localhost:4200/login');

    // CSS temporal para centrar login y evitar que suba al escribir
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

    // Interceptar la petición PUT que actualizará el pedido
    cy.intercept('PUT', new RegExp(`/api/pedidos/estado/${pedidoId}\\?.*`)).as('updatePedido');

    // -------------------------------
    // Localizar directamente la tarjeta del pedido #7
    // -------------------------------
    cy.contains('.pedido-card', `Pedido #${pedidoId}`)
      .scrollIntoView()   // Hace scroll hasta que sea visible
      .as('pedidoCard');

    // Cambiar estado dentro de la tarjeta específica
    cy.get('@pedidoCard').find('select')
      .scrollIntoView()
      .select(nuevoEstado, { force: true })
      .trigger('change');

    // Verificar que Angular actualizó el ngModel
    cy.get('@pedidoCard').find('select').should('have.value', nuevoEstado);

    // Esperar respuesta del backend
    cy.wait('@updatePedido').its('response.statusCode').should('eq', 200);

    // Opcional: verificar mensaje de notificación
    // cy.contains('Estado actualizado', { timeout: 5000 }).should('exist');
  });
});
