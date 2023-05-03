const mainScreenPage = {
  checkHelloWorld: () => {
    cy.get('.hello-world').should('be.visible');
  },
};

export default mainScreenPage;
