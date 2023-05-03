import { existsSync, readFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { defaultBaseUrl, defaults, appName } from './defaults';
import { CypressEnvironment } from './types';

const {
  CYPRESS_BASE_BACKEND_URL,
  CYPRESS_TAGS,
  CYPRESS_FEATURES,
  CYPRESS_VIEWPORT_HEIGHT,
  CYPRESS_VIEWPORT_WIDTH,
  CYPRESS_DEFAULT_TIMEOUT,
  MOCKED_E2E
} = process.env;


let env: CypressEnvironment = {
  appName,
  BASE_URL: defaultBaseUrl,
  BASE_BACKEND_URL: CYPRESS_BASE_BACKEND_URL || defaults.baseBackendUrl,
  viewportHeight: CYPRESS_VIEWPORT_HEIGHT
    ? parseInt(CYPRESS_VIEWPORT_HEIGHT)
    : defaults.viewportHeight,
  viewportWidth: CYPRESS_VIEWPORT_WIDTH
    ? parseInt(CYPRESS_VIEWPORT_WIDTH)
    : defaults.viewportWidth,
  TAGS: CYPRESS_TAGS || '',
  FEATURES: CYPRESS_FEATURES || defaults.features,
  defaultTimeout: CYPRESS_DEFAULT_TIMEOUT
    ? parseInt(CYPRESS_DEFAULT_TIMEOUT)
    : 5000,
  waitForAnimations: MOCKED_E2E !== 'true'
};

const envPath = resolve('./cypress.env.json');

if (existsSync(envPath)) {
  const envFromFile = JSON.parse(readFileSync(envPath, { encoding: 'utf-8' }));

  env =
    MOCKED_E2E === 'true'
      ? {
          ...envFromFile,
          ...env
        }
      : {
          ...env,
          ...envFromFile
        };
}

const reportPath = resolve('./report');

if (!existsSync(reportPath)) {
  mkdirSync(reportPath);
}


const finalEnv = {
  reportPath,
  defaults,
  env,
};

export default finalEnv;
