/* eslint-disable no-console */
import { defaults } from './defaults';
import finalEnv from './env';
import { CypressConfig } from './types';

const { env } = finalEnv;

console.log('Using this envs to run tests:', env);

const getTestFiles = (envFeatures: string | null): string | string[] => {
  if (!envFeatures || envFeatures === defaults.features) {
    return defaults.features;
  }

  const separator = envFeatures.includes(',') ? ',' : ' ';

  return envFeatures
    .split(separator)
    .filter((feature) => !!feature)
    .map((feature) => {
      const trimFeature = feature.trim();

      return trimFeature.substring(0, 1) === '*'
        ? trimFeature
        : '**/' + feature.trim();
    });
};

const specPattern = getTestFiles(env.FEATURES);

const cypressConfig: CypressConfig = {
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'report/errors',
  viewportHeight: env.viewportHeight
    ? env.viewportHeight
    : defaults.viewportHeight,
  viewportWidth: env.viewportWidth ? env.viewportWidth : defaults.viewportWidth,
  e2e: {
    baseUrl: env.BASE_URL,
    supportFile: 'config/global.ts',
    excludeSpecPattern: '*.ts',
    specPattern
  },
  defaultCommandTimeout: env.defaultTimeout,
  waitForAnimations: env.waitForAnimations
};

console.log('Using this Cypress config to run tests:', cypressConfig);

export default {
  cypressConfig,
  env
};
