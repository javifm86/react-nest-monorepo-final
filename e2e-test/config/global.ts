declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM elements inside our app even in AEM env.
       * @example cy.getNode('.yourSelector')
       */
      getNode(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Needed for AEM
const ignoredErrors = ['top.$ is not a function'];

Cypress.on(
  'uncaught:exception',
  (err) => !ignoredErrors.find((error) => err.message.includes(error))
);

Cypress.Commands.add('getNode', (selector: string) => {
  if (selector.charAt(0) === '@') {
    cy.get(selector);

    return;
  }
  cy.get(`#${Cypress.env('appName')}-root`)
    .parent()
    .as('rootApp');
  cy.get('@rootApp').find(selector);
});

export {};
