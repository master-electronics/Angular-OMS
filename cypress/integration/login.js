describe('Login page', () => {
  it('Test login', () => {
    cy.visit('http://localhost:4200/');
    cy.get('form').find('input[id="username"]').type('salive');
    cy.get('form').find('input[id="password"]').type('Master@2425');
    cy.get('form').find('button[id="login"]').click();
    cy.url().should('include', '/home');
  });
});
