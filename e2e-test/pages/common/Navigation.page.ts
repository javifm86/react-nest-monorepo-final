const navigationPage = {
  start: (url) => {
    cy.visit(url);
    cy.get('.loading-spinner').should('not.exist');
  }
};

export default navigationPage;
