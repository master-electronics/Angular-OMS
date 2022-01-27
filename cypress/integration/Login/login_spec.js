describe('Login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('login wrong password', () => {
    cy.get('form').find('input[id="username"]').type('salive');
    cy.get('form').find('input[id="password"]').type('worng');
    cy.get('form').find('button[id="login"]').click();
    cy.get('form').find('nz-alert');
  });

  it('login success', () => {
    cy.get('form').find('input[id="username"]').type('salive');
    cy.get('form').find('input[id="password"]').type('Master@2425');
    cy.get('form').find('button[id="login"]').click();
    cy.url().should('include', '/home');
  });
});
