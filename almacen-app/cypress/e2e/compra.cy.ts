/// <reference types="cypress" />

describe('Flujo completo: Login y compra desde el carrito', () => {
  const correo = 'raulspotify6106@gmail.com';
  const password = 'raul1234';

  it('Login, añadir producto al carrito y realizar pedido desde el modal', () => {
    cy.visit('http://localhost:4200/login');

    cy.get('input[name="correo"]').type(correo);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.contains('✓ Acceso concedido', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    cy.get('.producto-card').first().within(() => {
      cy.get('.quick-add-btn').click();
    });

    cy.get('.carrito-wrapper').click();

    cy.get('.cart-modal', { timeout: 5000 }).should('be.visible');

    cy.get('.cart-item').should('have.length.greaterThan', 0);

    cy.get('button.checkout-btn').click();

    cy.contains('✓ Pedido realizado con éxito', { timeout: 10000 }).should('exist');
  });
});
