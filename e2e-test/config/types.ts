export type CypressConfig = Partial<Cypress.ResolvedConfigOptions>;

/* eslint-enable no-unused-vars */

export interface CypressEnvironment extends Partial<Cypress.Config> {
  appName: string;
  BASE_URL: string;
  BASE_BACKEND_URL: string;
  TAGS: string;
  FEATURES: string;
  NODE_ENV?: string;
  viewportHeight: number;
  viewportWidth: number;
  defaultTimeout: number;
}
